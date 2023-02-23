import { Action, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { prisma } from "../index";
import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { UserService } from "../services/UserService";

export interface IJsonPay {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional
  constructor(private userService: UserService) {}

  async use(req: any, res: any, next: (err?: any) => any): Promise<any> {
    console.log("do something...");
    try {
      const token = req.headers["authorization"];
      const deviceId = req.headers["deviceId"];
      console.log(token);
      console.log(deviceId);

      if (!token) {
        res.send("A token is required for authentication");
      }
      /** 
      if (!deviceId) {
        res.send("Device Id is required for authentication");
      }**/

      try {
        const decoded = jwt.verify(token, "secret");
        console.log('abcd');
        console.log(decoded);
        req.user = decoded;
        /** 
        if (decoded) {
          try {
            const verifyUser = await this.userService.verifyUser(token);
            console.log(verifyUser);
            //console.log(decoded.userId);
            if (verifyUser && token === verifyUser.accessToken) {
              next();
            } else {
              throw new Error("Invalid token different user");
            }
          } catch (error) {
            throw error;
          }
        }**/
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          res.send("Token Expired");
        } else {
          res.send("Invalid Token");
        }
      }
    } catch (err) {
      throw err;
    }
  }

  /**async authorizationChecker(action: Action, roles: string[]) {
    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    // demo code:
    console.log(action);
    console.log('abacd');
    const token = action.request.headers['authorization'];

    //const user = await getEntityManager().findOneByToken(User, token);
    //if (user && !roles.length) return true;
   // if (user && roles.find(role => user.roles.indexOf(role) !== -1)) return true;

    return false;
  }**/
}
