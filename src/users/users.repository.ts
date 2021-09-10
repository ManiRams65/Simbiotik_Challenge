/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { UserDocument } from './users.schema';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  createNewUser(newUser: CreateUserDto) {
    return new this.userModel(newUser).save({
      validateBeforeSave: true,
      timestamps: true,
    });
  }
  findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  updateForReset(email: string) {
    return this.userModel.findOneAndUpdate({ email }, { is_reset: true });
  }

  checkForUpdation(email: string) {
    return this.userModel.findOne({ email, is_reset: false });
  }
  updatePassword(id: ObjectId, password: string) {
    return this.userModel.findOneAndUpdate(
      { _id: id },
      { password: password, is_reset: false },
    );
  }
}
