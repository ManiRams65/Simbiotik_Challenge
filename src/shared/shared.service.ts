/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../auth/constants';
import { JwtPayload } from '../users/dto/user.dto';

@Injectable()
export class SharedService {
  constructor() {}
  createHash = (stringToHash: string) =>
    crypto.createHash('sha256').update(stringToHash).digest('hex');

  signJWT = (user: JwtPayload) => {
    const { email, _id } = user;
    return jwt.sign({ email, _id }, jwtConstants.secret, {
      expiresIn: '4h',
      algorithm: 'HS256',
      issuer: 'Simbiotik Authentication API',
      audience: 'Simbiotik Client',
      subject: `${email} - ${_id}`,
    });
  };
}
