import { Injectable } from '@nestjs/common';
import { Follower, FollowerDocument } from './entities/follower.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { sendFollowNotification } from '../shared/services/notificationSender/notificationSender';


@Injectable()
export class FolloweService {
  constructor(
    @InjectModel(Follower.name)
    private followerModel: Model<FollowerDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createFollower(followerId: MongooSchema.Types.ObjectId, followingId: MongooSchema.Types.ObjectId ) {
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
      follower: followerId
    });
    await createdFollower.save();

    // Update follower/following counts
    const follower = await this.userModel.findByIdAndUpdate(followerId, { $inc: {followingCount: 1}})
    const following = await this.userModel.findByIdAndUpdate(followingId, { $inc: {followerCount: 1}})
    console.log(follower);

    await sendFollowNotification(following.fcmToken, follower.name, follower.id, );
    return following
  }

  async unFollow(followerId: MongooSchema.Types.ObjectId, followingId: MongooSchema.Types.ObjectId) {
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

    return following;
  }

  async getFollowings(userId: MongooSchema.Types.ObjectId) {
    const followings = await this.followerModel
      .find({ follower: userId, deleted_at: { $eq: null } }) 
      .populate('following') 
      .exec();
    
    const result = followings.map(f => f.following); 
    return result;
  }

  async getFollowers(userId: MongooSchema.Types.ObjectId) {
    const followers = await this.followerModel
      .find({ following: userId, deleted_at: { $eq: null } }) 
      .populate('follower')
      .exec();
    
    const result = followers.map(f => f.follower); 
    console.log(result);
    return result;
  }
}
