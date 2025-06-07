import { Injectable } from '@nestjs/common';
import { Follower, FollowerDocument } from './entities/follower.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import {
  NotificationService,
  sendNotification,
} from '../notification/notification.service';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class FolloweService {
  constructor(
    @InjectModel(Follower.name)
    private followerModel: Model<FollowerDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly notificationService: NotificationService,
    private readonly paginationService: PaginationService,
  ) {}

  async createFollower(
    followerId: MongooSchema.Types.ObjectId,
    followingId: MongooSchema.Types.ObjectId,
  ) {
    // Prevent self-following (optional)
    if (followerId === followingId) {
      throw new Error("you_can't_follow_yourself");
    }

    // Check if already following
    const existingFollow = await this.followerModel.findOne({
      follower: followerId,
      following: followingId,
    });
    if (existingFollow) {
      throw new Error('you_are_already_following_this_user');
    }

    // Create new follow
    const createdFollower = new this.followerModel({
      following: followingId,
      follower: followerId,
    });
    await createdFollower.save();

    // Update follower/following counts
    const follower = await this.userModel.findByIdAndUpdate(followerId, {
      $inc: { followingCount: 1 },
    });
    const following = await this.userModel.findByIdAndUpdate(followingId, {
      $inc: { followerCount: 1 },
    });

    const notificationData: sendNotification = {
      expoPushToken: following.fcmToken,
      sender: follower,
      reciever: following,
    };

    await this.notificationService.sendFollowNotification(notificationData);
    following.isFollowing = true;
    following.followerCount += 1;
    follower.followingCount += 1;

    return {
      follower,
      followingEdge: {
        cursor: following.id,
        node: following,
      },
    };
  }

  async unFollow(
    followerId: MongooSchema.Types.ObjectId,
    followingId: MongooSchema.Types.ObjectId,
  ) {
    if (followerId === followingId) {
      throw new Error("you_can't_unfollow_yourself");
    }
    // Find the follow relationship
    const existingFollow = await this.followerModel.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!existingFollow) {
      throw new Error('you_are_not_following_this_user');
    }
    // Decrement counters
    const follower = await this.userModel.findByIdAndUpdate(followerId, {
      $inc: { followingCount: -1 },
    });

    const following = await this.userModel.findByIdAndUpdate(followingId, {
      $inc: { followerCount: -1 },
    });

    following.isFollowing = false;
    following.followerCount -= 1;
    follower.followingCount -= 1;
    return { follower, following };
  }

  async getFollowings(
    pagination: PaginationArgs,
    userId: MongooSchema.Types.ObjectId,
  ) {
    const followings = await this.followerModel
      .find({ follower: userId, deleted_at: { $eq: null } })
      .populate('following')
      .exec();

    const result = followings.map((f) => f.following);
    const followingIds = new Set(
      followings.map((f) => f.following.id.toString()),
    );

     for (const user of result) {
      const userRank =
        (await this.userModel.countDocuments({
          score: { $gt: user.score },
        })) + 1;
      user.rank = userRank;
      user.isFollowing = followingIds.has(user.id.toString());
    }

    result.sort((a, b) => a.rank - b.rank);

    return await this.paginationService.paginate(
      result as unknown as { _id: any }[],
      pagination,
    );
  }

  async getFollowers(
    pagination: PaginationArgs,
    userId: MongooSchema.Types.ObjectId,
  ) {
    const followers = await this.followerModel
      .find({ following: userId, deleted_at: { $eq: null } })
      .populate('follower')
      .exec();

    const result = followers.map((f) => f.follower);

    const followDocs = await this.followerModel
      .find({
        follower: userId,
        following: { $in: result.map((u) => u.id) },
      })
      .select('following');

    const followingIds = new Set(followDocs.map((f) => f.following.toString()));

    for (const user of result) {
      const userRank =
        (await this.userModel.countDocuments({
          score: { $gt: user.score },
        })) + 1;
      user.rank = userRank;
      user.isFollowing = followingIds.has(user.id.toString());
    }

    result.sort((a, b) => a.rank - b.rank);
    
    return await this.paginationService.paginate(
      result as unknown as { _id: any }[],
      pagination,
    );
  }
}
