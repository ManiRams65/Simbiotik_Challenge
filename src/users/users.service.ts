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
    const { email } = createUser; //Destructure the Object
    //Check if the user exists
    if (await this.userRepository.findOneByEmail(email))
      throw new HttpException(
        'User Already Exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    try {
      createUser.password = this.sharedService.createHash(createUser.password); //Hash the password

      const newUserCreated = await this.userRepository.createNewUser(
        createUser,
      ); //Save the new user
      return newUserCreated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); //Throw in case of error
    }
  }

  //Find the User by email ID
  findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  //Forgot Password
  async forgotPassword(email: ForgotPasswordDto) {
    const { mail } = email; //Destructure the Object
    try {
      const user = await this.userRepository.findOneByEmail(mail); //Find the User by email ID

      if (!user)
        //Throw an error if user is not found
        throw new HttpException('Invalid Email Id', HttpStatus.BAD_REQUEST);

      //Check if the user is already requesting a password
      if (!(await this.userRepository.checkForUpdation(mail)))
        throw new HttpException(
          'Already Requested for Updation',
          HttpStatus.BAD_REQUEST,
        );

      const updateForReset = await this.userRepository.updateForReset(mail); //Update the key and return the string on success

      if (updateForReset)
        //URL for password reset
        return `User can reset the password through this URL http://localhost:4000/api/users/reset-password/${user._id}`;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); //Throw in case of error
    }
  }

  //Reset Password
  async resetPassword(id: ObjectId, new_password: string) {
    const hashedPassword = this.sharedService.createHash(new_password); //Hash the password

    //Reset the password
    const updatedPassword = await this.userRepository.updatePassword(
      id,
      hashedPassword,
    );
    return updatedPassword;
  }
}
