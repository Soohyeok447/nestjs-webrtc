import { User, UserModel } from "../models/userModel";

class UserRepository {
  public async create({ id, socketId, refreshToken, tags, bans }: User): Promise<User> {
    const user = new UserModel({ id, socketId, refreshToken, tags, bans });

    return await user.save();
  }

  public async findById(id: string): Promise<User | null> {
    return await UserModel.findOne({ id }).exec();
  }

  public async update({ id, refreshToken, tags, bans }): Promise<User> {
    const user = await UserModel.findOne({ id }).exec();

    user.refreshToken = refreshToken !== undefined ? refreshToken : user.refreshToken;
    user.tags = tags !== undefined ? tags : user.tags;
    user.bans = bans !== undefined ? bans : user.bans;

    return await user.save();
  }
}

export default new UserRepository();