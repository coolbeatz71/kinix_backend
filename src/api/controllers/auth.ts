import { Request, Response } from 'express';

export class Auth {
  /**
   * controller to sign up the user
   * @param req Request
   * @param res Response
   */
  public async signup(req: Request, res: Response): Promise<any> {}
}

const authCtrl = new Auth();
export default authCtrl;
