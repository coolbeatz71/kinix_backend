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
    await validate.names(this.req, 'userName', this.req.t('LABEL_USERNAME'));
    await validate.password(this.req, 'password');
  };

  login = async (): Promise<void> => {
    await validate.empty(this.req, 'credential', this.req.t('LABEL_EMAIL_USERNAME'));
    await validate.password(this.req, 'password');
  };

  socialLogin = async (): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', this.req.t('LABEL_USERNAME'));
  };

  update = async (isPhonePartial: boolean, params: ICountryParams): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', this.req.t('LABEL_USERNAME'));
    if (isPhonePartial) {
      const { phoneDialCode, phoneISOCode, phonePartial, countryFlag } = params;
      await validate.url(this.req, 'countryFlag', this.req.t('LABEL_COUNTRY_FLAG'));
      await validate.empty(this.req, 'countryName', this.req.t('LABEL_COUNTRY_NAME'));
      await validate.phone(this.req, 'phonePartial', this.req.t('LABEL_TELEPHONE'), {
        countryFlag,
        phonePartial,
        phoneISOCode,
        phoneDialCode,
      });
    }
  };

  changePassword = async (): Promise<void> => {
    await validate.empty(this.req, 'oldPassword', this.req.t('LABEL_OLD_PASSWORD'));
    await validate.password(this.req, 'newPassword');
  };

  changeAvatar = async (): Promise<void> => {
    await validate.url(this.req, 'avatar', this.req.t('LABEL_AVATAR_URL'));
  };

  confirmAccount = async (): Promise<void> => {
    await validate.empty(this.req, 'credential', this.req.t('LABEL_EMAIL_USERNAME'));
    await validate.empty(this.req, 'otp', this.req.t('LABEL_OTP_CODE'));
  };

  resendOTP = async (): Promise<void> => {
    await validate.empty(this.req, 'credential', this.req.t('LABEL_EMAIL_USERNAME'));
  };
}

export default AuthValidator;
