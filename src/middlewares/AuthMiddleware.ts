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
    console.log(
      "inside authentication middelware in authentication micro serice"
    );
    try {
      console.log(req.headers);
      const token = req.headers["authorization"];
      const deviceId = req.headers["deviceid"];
      console.log(token);
      console.log(deviceId);

      if (!token) {
        res.status(401).send(
          JSON.stringify({
            status: "failed",
            data: "A token is required",
          })
        );
      }
      if (!deviceId) {
        res.status(401).send(
          JSON.stringify({
            status: "failed",
            data: "Device id  is required",
          })
        );
      }

      try {
        const decoded = jwt.verify(token, String(process.env.TOKEN_KEY));
        console.log("abcd");
        console.log(decoded);
        req.user = decoded;
        //next();
        res.status(200).send(
          JSON.stringify({
            status: "success",
            data: "User Logged In",
          })
        );
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
          res.status(401).send(
            JSON.stringify({
              status: "failed",
              data: "Token Expired",
            })
          );
        } else {
          res.status(401).send(
            JSON.stringify({
              status: "failed",
              data: "Invalid Token",
            })
          );
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
