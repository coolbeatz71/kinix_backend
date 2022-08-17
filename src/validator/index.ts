import { Request } from 'express';
import { check } from 'express-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';
import countryList from '../constants/countries';
import { ICountryObject, ICountryParams } from '../interfaces/countryObject';

export class Validator {
  /**
   * validate names (firstName or lastName)
   * @param req Request
   * @param field string
   * @param label string
   * @returns {void} Promise<void>
   */
  names = async (req: Request, field: string, label: string): Promise<void> => {
    await this.empty(req, field, label);
    await check(field)
      .trim()
      .matches(/^[a-zA-Z\-\s]+$/)
      .withMessage(`${label} can only contain alphatic characters`)
      .isLength({ min: 3 })
      .withMessage(`${label} must be at least 3 characters long`)
      .run(req);
  };

  /**
   * validate empty fields
   * @param req Request
   * @param field string
   * @param label string
   * @returns {void} Promise<void>
   */
  empty = async (req: Request, field: string, label: string): Promise<void> => {
    await check(field).trim().not().isEmpty().withMessage(`${label} cannot be empty`).run(req);
  };

  /**
   * validate password
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  password = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, 'password');
    await check(field)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
      .withMessage(
        'password must have at least 6 digits and contain 1 Uppercase, 1 Lowercase, 1 number',
      )
      .run(req);
  };

  /**
   * validate email address
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  email = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, 'email address');
    await check(field).trim().isEmail().withMessage('email address is invalid').run(req);
  };

  /**
   * validate phone number
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  phoneNumber = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, 'phone number');
    await check(field)
      .trim()
      .isMobilePhone('any', { strictMode: true })
      .withMessage('phone number is invalid')
      .run(req);
  };

  /**
   * validate rate count
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  rate = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, 'rate count');
    await check(field)
      .isFloat({ min: 1, max: 5 })
      .withMessage('rate count must be a number between 1 and 5')
      .run(req);
  };

  /**
   * validate URL, (useful to validate avatar URL)
   * @param req Request
   * @param field string
   * @param label string
   * @returns {void} Promise<void>
   */
  url = async (req: Request, field: string, label: string): Promise<void> => {
    await this.empty(req, field, label);
    await check(field).trim().isURL().withMessage(`${label} must be a valid URL`).run(req);
  };

  /**
   * validate extended telephone
   * @param req Request
   * @param field string
   * @param label string
   * @param params ICountryParams
   */
  phone = async (req: Request, field: string, label: string, params: ICountryParams) => {
    await this.empty(req, field, label);
    await check(field)
      .trim()
      .custom(() => {
        const regexPhone = /^[0-9]{1,13}$/;
        const regexDialCode = /^\+\d{1,4}$/;
        const regexISOCode = /^[A-Z]{2}$/i;
        const { phoneISOCode, phoneDialCode, phonePartial } = params;

        if (!phoneISOCode || !phoneISOCode.match(regexISOCode)) {
          return Promise.reject(new Error('country ISO code has an invalid format'));
        }

        if (!phonePartial || !phonePartial.match(regexPhone)) {
          return Promise.reject(new Error('partial telephone has an invalid format'));
        }

        if (!phoneDialCode || !phoneDialCode.match(regexDialCode)) {
          return Promise.reject(new Error('phone dial code has an invalid format'));
        }

        const fullPhoneNumber = `${phoneDialCode}${phonePartial}`;
        const country = countryList.find(
          (ct: ICountryObject) => ct.dialCode === phoneDialCode && ct.isoCode === phoneISOCode,
        );
        const isoCode = country?.isoCode;

        if (!country) return Promise.reject(new Error('telephone has missing information'));

        return PhoneNumberUtil.getInstance().isValidNumberForRegion(
          PhoneNumberUtil.getInstance().parse(fullPhoneNumber, isoCode),
          isoCode,
        )
          ? Promise.resolve()
          : Promise.reject(new Error('telephone has an invalid format'));
      })
      .run(req);
  };
}

const validate = new Validator();
export default validate;
