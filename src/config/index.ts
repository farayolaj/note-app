import { ConfigFactory, ConfigObject } from '@nestjs/config';
import * as Joi from 'joi';

export const configuration: ConfigFactory<ConfigObject> = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
});
