import { Request } from 'express';
import { check } from 'express-validator';

export class Validator {
  /**
   * validate names (firstName or lastName)
   * @param req Request
   * @param field string
   * @param nameType string
   * @returns {void} Promise<void>
   */
  names = async (req: Request, field: string, nameType: string): Promise<void> => {
    await this.empty(req, field, nameType);
    await check(field)
      .trim()
      .matches(/^[a-zA-Z\-\s]+$/)
      .withMessage(`${nameType} can only contain alphatic characters`)
      .isLength({ min: 3 })
      .withMessage(`${nameType} must be at least 3 characters long`)
      .run(req);
  };

  /**
   * validate empty fields
   * @param req Request
   * @param field string
   * @param nameType string
   * @returns {void} Promise<void>
   */
  empty = async (req: Request, field: string, nameType: string): Promise<void> => {
    await check(field).trim().not().isEmpty().withMessage(`${nameType} cannot be empty`).run(req);
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
    await check(field).trim().not().isEmpty().withMessage('email address cannot be empty').run(req);
    await check(field).trim().isEmail().withMessage('email address is invalid').run(req);
  };

  /**
   * validate phone number
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  phoneNumber = async (req: Request, field: string): Promise<void> => {
    await check(field).trim().not().isEmpty().withMessage('phone number cannot be empty').run(req);
    await check(field)
      .trim()
      .isMobilePhone('any', { strictMode: true })
      .withMessage('phone number is invalid')
      .run(req);
  };
}

const validate = new Validator();
export default validate;
