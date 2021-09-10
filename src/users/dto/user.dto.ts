import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

/**
 * CREATE_USER
 * Received when user tries to create user
 *
 * + Check for email already exist
 * + If not create the user
 *
 */
export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @IsPhoneNumber('IN')
  @ApiProperty()
  phone_no: string;

  @IsString()
  @ApiProperty()
  company_name: string;
}

/**
 * LOGIN_REQUEST
 * Received when user tries to login
 *
 * + Check for email and password
 * + Sign the JWT on success
 *
 */
export class LoginRequestDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  password: string;
}

export interface JwtPayload {
  _id: string;
  email: string;
}
/**
 * USER_LOGIN_SUCCESS
 * Success Response of USER LOGIN
 *
 * + Check for email and password
 * + Sign the JWT on success
 *
 */
export class UserLoginSuccessDTO {
  _id?: ObjectId;
  email: string;
  token: string;
}

export class UserDto {
  _id?: ObjectId;
  email: string;
  company_name: string;
  phone_no: string;
}

export class ForgotPasswordDto {
  mail: string;
}

export class ResetPasswordDTO {
  new_password: string;
}
