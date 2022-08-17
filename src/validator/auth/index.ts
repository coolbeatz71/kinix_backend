/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';
import { ICountryParams } from '../../interfaces/countryObject';

class AuthValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  signup = async (): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', 'username');
    await validate.password(this.req, 'password');
  };

  login = async (): Promise<void> => {
    await validate.empty(this.req, 'credential', 'username or email');
    await validate.password(this.req, 'password');
  };

  update = async (isPhonePartial: boolean, params: ICountryParams): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', 'username');
    if (isPhonePartial) {
      const { phoneDialCode, phoneISOCode, phonePartial, countryFlag } = params;
      await validate.url(this.req, 'countryFlag', 'country flag');
      await validate.empty(this.req, 'countryName', 'country name');
      await validate.phone(this.req, 'phonePartial', 'telephone', {
        countryFlag,
        phonePartial,
        phoneISOCode,
        phoneDialCode,
      });
    }
  };

  changePassword = async (): Promise<void> => {
    await validate.empty(this.req, 'oldPassword', 'old password');
    await validate.password(this.req, 'newPassword');
  };

  changeAvatar = async (): Promise<void> => {
    await validate.url(this.req, 'avatar', 'avatar url');
  };
}

export default AuthValidator;
