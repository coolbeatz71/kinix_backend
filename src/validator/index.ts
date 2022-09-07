import dayjs from 'dayjs';
import { Request } from 'express';
import { check } from 'express-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { isDate } from 'lodash';
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
      .matches(/^[a-zA-Z0-9\-\s]+$/)
      .withMessage(req.t('VALIDATOR_ALPHANUMERIC', { label }))
      .isLength({ min: 3 })
      .withMessage(req.t('VALIDATOR_MIN', { label }))
      .run(req);
  };

  /**
   * validate dates (startDate)
   * @param req Request
   * @param field string
   * @param label string
   * @returns {void} Promise<void>
   */
  date = async (req: Request, field: string, label: string): Promise<void> => {
    await this.empty(req, field, label);
    await check(field)
      .custom((value) => {
        const date = dayjs(value).toDate();
        return isDate(date)
          ? Promise.resolve()
          : Promise.reject(new Error(req.t('VALIDATOR_DATE', { label })));
      })
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
    await check(field)
      .trim()
      .not()
      .isEmpty()
      .withMessage(req.t('VALIDATOR_EMPTY', { label }))
      .run(req);
  };

  /**
   * validate price (promotion)
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  price = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, req.t('LABEL_PRICE'));
    await check(field).isFloat({ min: 0 }).withMessage(req.t('VALIDATOR_PRICE')).run(req);
  };

  /**
   * validate duration (promotion)
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  duration = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, req.t('LABEL_DURATION'));
    await check(field).isInt({ min: 0 }).withMessage(req.t('VALIDATOR_DURATION')).run(req);
  };

  /**
   * validate password
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  password = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, req.t('LABEL_PASSWORD'));
    await check(field)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
      .withMessage(req.t('VALIDATOR_PASSWORD'))
      .run(req);
  };

  /**
   * validate email address
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  email = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, req.t('LABEL_EMAIL'));
    await check(field).trim().isEmail().withMessage(req.t('VALIDATOR_EMAIL')).run(req);
  };

  /**
   * validate phone number
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  phoneNumber = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, req.t('LABEL_TELEPHONE'));
    await check(field)
      .trim()
      .isMobilePhone('any', { strictMode: true })
      .withMessage(req.t('VALIDATOR_TELEPHONE'))
      .run(req);
  };

  /**
   * validate rate count
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  rate = async (req: Request, field: string): Promise<void> => {
    await this.empty(req, field, req.t('LABEL_RATE_COUNT'));
    await check(field)
      .isInt({ min: 1, max: 5 })
      .withMessage(req.t('VALIDATOR_RATE_COUNT'))
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
    await check(field).trim().isURL().withMessage(req.t('VALIDATOR_URL', { label })).run(req);
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
          return Promise.reject(new Error(req.t('VALIDATOR_COUNTRY_ISO')));
        }

        if (!phonePartial || !phonePartial.match(regexPhone)) {
          return Promise.reject(new Error(req.t('VALIDATOR_PARTIAL_TELEPHONE')));
        }

        if (!phoneDialCode || !phoneDialCode.match(regexDialCode)) {
          return Promise.reject(new Error(req.t('VALIDATOR_PHONE_DIAL_CODE')));
        }

        const fullPhoneNumber = `${phoneDialCode}${phonePartial}`;
        const country = countryList.find(
          (ct: ICountryObject) => ct.dialCode === phoneDialCode && ct.isoCode === phoneISOCode,
        );
        const isoCode = country?.isoCode;

        if (!country) return Promise.reject(new Error(req.t('VALIDATOR_TELEPHONE_BROKEN')));

        return PhoneNumberUtil.getInstance().isValidNumberForRegion(
          PhoneNumberUtil.getInstance().parse(fullPhoneNumber, isoCode),
          isoCode,
        )
          ? Promise.resolve()
          : Promise.reject(new Error(req.t('VALIDATOR_TELEPHONE_FORMAT')));
      })
      .run(req);
  };
}

const validate = new Validator();
export default validate;
