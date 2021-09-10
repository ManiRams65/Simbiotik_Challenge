/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LoginRequestDto, UserLoginSuccessDTO } from 'src/users/dto/user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBadRequestResponse({ description: 'Bad Request Body' })
  login(@Body() loginDto: LoginRequestDto): Promise<UserLoginSuccessDTO> {
    return this.authService.login(loginDto);
  }
}
