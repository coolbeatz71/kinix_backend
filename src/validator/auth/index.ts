/* eslint-disable consistent-return */
import { Request } from 'express';
import i18next from 'i18next';
import validate from '..';
import { ICountryParams } from '../../interfaces/countryObject';

class AuthValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  signup = async (): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', i18next.t('LABEL_USERNAME'));
    await validate.password(this.req, 'password');
  };

  login = async (): Promise<void> => {
    await validate.empty(this.req, 'credential', i18next.t('LABEL_EMAIL_USERNAME'));
    await validate.password(this.req, 'password');
  };

  update = async (isPhonePartial: boolean, params: ICountryParams): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', i18next.t('LABEL_USERNAME'));
    if (isPhonePartial) {
      const { phoneDialCode, phoneISOCode, phonePartial, countryFlag } = params;
      await validate.url(this.req, 'countryFlag', i18next.t('LABEL_COUNTRY_FLAG'));
      await validate.empty(this.req, 'countryName', i18next.t('LABEL_COUNTRY_NAME'));
      await validate.phone(this.req, 'phonePartial', i18next.t('LABEL_TELEPHONE'), {
        countryFlag,
        phonePartial,
        phoneISOCode,
        phoneDialCode,
      });
    }
  };

  changePassword = async (): Promise<void> => {
    await validate.empty(this.req, 'oldPassword', i18next.t('LABEL_OLD_PASSWORD'));
    await validate.password(this.req, 'newPassword');
  };

  changeAvatar = async (): Promise<void> => {
    await validate.url(this.req, 'avatar', i18next.t('LABEL_AVATAR_URL'));
  };
}

export default AuthValidator;
