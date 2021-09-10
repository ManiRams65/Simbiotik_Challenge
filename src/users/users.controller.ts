/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDTO,
  UserDto,
} from './dto/user.dto';
import { ObjectId } from 'mongoose';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request Body' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Post('forgot-password')
  @ApiOkResponse({ description: 'URL for Resetting the Password' })
  forgotPassword(@Body() email: ForgotPasswordDto): Promise<string> {
    return this.usersService.forgotPassword(email);
  }

  @Patch('reset-password/:id')
  @ApiOkResponse({ description: 'URL for Resetting the Password' })
  resetPassword(
    @Param('id') id: ObjectId,
    @Body() new_password: ResetPasswordDTO,
  ): Promise<UserDto> {
    console.log(id, new_password);
    return this.usersService.resetPassword(id, new_password.new_password);
  }
}
