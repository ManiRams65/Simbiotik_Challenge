import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  password: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  phone_no: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  company_name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    default: false,
  })
  is_reset: boolean;
}
