import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { name, internet, phone, image } from 'faker';
import { ERole } from '../../interfaces/role';
import { EProvider } from '../../interfaces/provider';

dotenv.config();

// generate encryoted password
const plainPwd = process.env.USER_PASSWORD;
const password = bcrypt.hashSync(plainPwd, bcrypt.genSaltSync(8));

// generate createdDate and updateDate
const createdAt = dayjs().format();
const updatedAt = createdAt;

module.exports = [
  {
    userName: name.firstName(),
    email: internet.email(),
    phoneNumber: phone.phoneNumber(),
    password,
    provider: EProvider.LOCAL,
    isLoggedIn: false,
    verified: false,
    image: image.avatar(),
    role: ERole.VIDEO_CLIENT,
    createdAt,
    updatedAt,
  },
  {
    userName: name.firstName(),
    email: internet.email(),
    phoneNumber: phone.phoneNumber(),
    password,
    provider: EProvider.LOCAL,
    isLoggedIn: false,
    verified: false,
    image: image.avatar(),
    role: ERole.VIEWER_CLIENT,
    createdAt,
    updatedAt,
  },
  {
    userName: name.firstName(),
    email: internet.email(),
    phoneNumber: phone.phoneNumber(),
    password,
    provider: EProvider.LOCAL,
    isLoggedIn: false,
    verified: false,
    image: image.avatar(),
    role: ERole.ADS_CLIENT,
    createdAt,
    updatedAt,
  },
  {
    userName: name.firstName(),
    email: internet.email(),
    phoneNumber: phone.phoneNumber(),
    password,
    provider: EProvider.LOCAL,
    isLoggedIn: false,
    verified: false,
    image: image.avatar(),
    role: ERole.ADMIN,
    createdAt,
    updatedAt,
  },
  {
    userName: name.firstName(),
    email: internet.email(),
    phoneNumber: phone.phoneNumber(),
    password,
    provider: EProvider.LOCAL,
    isLoggedIn: false,
    verified: false,
    image: image.avatar(),
    role: ERole.SUPER_ADMIN,
    createdAt,
    updatedAt,
  },
];
