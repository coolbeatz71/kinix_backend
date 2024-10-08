import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { name, internet, image } from 'faker';
import ERole from '../../../interfaces/role';
import { IUser } from '../../../interfaces/model';

dotenv.config();

// generate encryoted password
const plainPwd = process.env.USER_PASSWORD;
const password = bcrypt.hashSync(plainPwd, bcrypt.genSaltSync(8));

// generate createdDate and updateDate
const createdAt = dayjs().format();
const updatedAt = createdAt;

const adminEmail = 'sigmacool@gmail.com';
const superAdminEmail = 'kinix2021@gmail.com';
const adminUserName = '@coolbeatz71';
const superAdminUserName = '@superadmin';

const UserData: IUser[] = [
  {
    userName: name.firstName(),
    email: internet.email(),
    password,
    image: image.avatar(),
    role: ERole.VIDEO_CLIENT,
    verified: true,
    createdAt,
    updatedAt,
  },
  {
    userName: name.firstName(),
    email: internet.email(),
    password,
    image: image.avatar(),
    role: ERole.VIEWER_CLIENT,
    createdAt,
    updatedAt,
  },
  {
    userName: name.firstName(),
    email: internet.email(),
    password,
    image: image.avatar(),
    role: ERole.ADS_CLIENT,
    createdAt,
    updatedAt,
  },
  {
    userName: adminUserName,
    email: adminEmail,
    password,
    image: image.avatar(),
    role: ERole.ADMIN,
    createdAt,
    updatedAt,
  },
  {
    userName: superAdminUserName,
    email: superAdminEmail,
    password,
    image: image.avatar(),
    role: ERole.SUPER_ADMIN,
    createdAt,
    updatedAt,
  },
];
export default UserData;
