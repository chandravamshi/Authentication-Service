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
export class RenewRefreshTokenMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional
  constructor(private userService: UserService) {}

  async use(req: any, res: any, next: (err?: any) => any): Promise<any> {
    console.log("do something...");
    try {
      const rToken = req.headers["refresh-token"];
      const deviceId = req.headers["device-id"];
      console.log(rToken);
      console.log(deviceId);

      if (!rToken) {
        res.send("A token is required for authentication");
      }

      if (!deviceId) {
        res.send("Device Id is required for authentication");
      }

      try {
        const decoded = jwt.verify(rToken, "secret");
        console.log("abcd");
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
        next();
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
}
