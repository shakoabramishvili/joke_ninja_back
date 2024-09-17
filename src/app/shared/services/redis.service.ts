import { HttpException, Inject, Injectable } from "@nestjs/common";
import { RedisClient } from "../providers/redis.provider";

@Injectable()
export class RedisCacheService {
  constructor(@Inject('REDIS_CLIENT')
              private readonly client: RedisClient,) {}

  private async get(key): Promise<any> {
    try {
      return await this.client.get(key);
    }catch (err) {
      throw new HttpException('redis_get_failed', 400);
    }
  }

  private async set(key, value, ttl?) {
    try {
      if (ttl) {
        await this.client.set(key, value, "EX", ttl);
      } else {
        await this.client.set(key, value);
      }
    } catch (err) {
      throw new HttpException('redis_set_failed', 400);
    }
  }

  async reset() {
    try {
      await this.client.reset();
    }catch (err) {
      throw new HttpException('redis_reset_failed', 400);
    }
  }

  private async del(key) {
    try {
      await this.client.del(key);
    }catch (err) {
      throw new HttpException('redis_del_failed', 400);
    }
  }

  async clearCache(baseUrl: string) {
    await this.del(baseUrl);
  }

  async save(baseUrl: string, value: any,  ttl: any = '') {
    if(value) {
      await this.set(baseUrl, value, ttl);
    }
    return value;
  }

  async find(baseUrl: string) {
    const data = await this.get(baseUrl);
    return data || null;
  }

  // Add member to the sorted set
  async addMemberToSortedSet(key: string, score: number, member: string): Promise<number> {
    return await this.client.zadd(key, score, member);
  }

  // Get members by score range (sorted by score ascending)
  async getMembersByScoreRange(key: string, min: number, max: number): Promise<string[]> {
    return await this.client.zrangebyscore(key, min, max);
  }

  // Get members with scores
  async getMembersWithScores(key: string, min: number, max: number): Promise<{ member: string, score: number }[]> {
    const result = await this.client.zrevrange(key, 0, 4, 'WITHSCORES');

  const membersWithScores = [];
  for (let i = 0; i < result.length; i += 2) {
    membersWithScores.push({
      member: result[i], 
      score: parseFloat(result[i + 1])
    });
  }
  const rank = await this.client.zrevrank(key, 'Shalva Abramishvili');
  console.log(rank, 'jjjjjjj')
  return membersWithScores;
  }

  // Remove member from sorted set
  async removeMemberFromSortedSet(key: string, member: string): Promise<number> {
    return await this.client.zrem(key, member);
  }

  // Get rank of a member
  async getMemberRank(key: string, member: string): Promise<number | null> {
    return await this.client.zrank(key, member);
  }
}