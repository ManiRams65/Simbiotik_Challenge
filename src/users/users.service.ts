/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CreateUserDto, ForgotPasswordDto } from './dto/user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private sharedService: SharedService,
    private userRepository: UsersRepository,
  ) {}

  //Create a new User object
  async create(createUser: CreateUserDto) {
    const { email } = createUser;
    if (await this.userRepository.findOneByEmail(email))
      throw new HttpException(
        'User Already Exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    try {
      createUser.password = this.sharedService.createHash(createUser.password);

      const newUserCreated = await this.userRepository.createNewUser(
        createUser,
      );
      return newUserCreated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //Find the User by email ID
  findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  async forgotPassword(email: ForgotPasswordDto) {
    const { mail } = email;
    try {
      const user = await this.userRepository.findOneByEmail(mail);
      if (!user)
        throw new HttpException('Invalid Email Id', HttpStatus.BAD_REQUEST);
      if (!(await this.userRepository.checkForUpdation(mail)))
        throw new HttpException(
          'Already Requested for Updation',
          HttpStatus.BAD_REQUEST,
        );

      const updateForReset = await this.userRepository.updateForReset(mail);

      if (updateForReset)
        return `User can reset the password through this URL http://localhost:4000/api/users/reset-password/${user._id}`;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(id: ObjectId, new_password: string) {
    const hashedPassword = await this.sharedService.createHash(new_password);

    const updatedPassword = await this.userRepository.updatePassword(
      id,
      hashedPassword,
    );
    console.log(updatedPassword);

    return updatedPassword;
  }
}
