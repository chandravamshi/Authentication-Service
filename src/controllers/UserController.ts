import {
  Body,
  Controller,
  Get,
  JsonController,
  Param,
  Post,
  QueryParams,
  Req,
  Res,
  UseAfter,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { ReqLoginUser, ReqRegisterUser } from "../dtos/users.dto";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RenewRefreshTokenMiddleware } from "../middlewares/RenewRefreshTokenMiddelware";
import { ValidationErrors } from "../middlewares/ValidationErrors";

import { UserService } from "../services/UserService";

@Service()
@JsonController("/user")
export class UserController {
  constructor(private userService: UserService) {}

  // create new user
  @Post("/create-user")
  @UseAfter(ValidationErrors)
  // @UseBefore(AuthMiddleware)
  async createNewUser(
    @Body({
      validate: {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false },
      },
    })
    createNewUserParams: ReqRegisterUser,
    @Res() response: any
  ): Promise<any> {
    try {
      const createNewUser = await this.userService.createUser(
        createNewUserParams
      );
      // console.log(createNewUser);
      return response.status(200).send({
        status: "success",
        data: createNewUser,
      });
    } catch (e) {
      throw e;
    }
  }

  //  login user
  @Post("/login-user")
  @UseAfter(ValidationErrors)
  //@UseAfter(AuthMiddleware)
  async loginUser(
    @Body({
      validate: {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false },
      },
    })
    createNewUserParams: ReqLoginUser,
    @Res() response: any
  ): Promise<any> {
    try {
      const loginUser = await this.userService.loginUser(createNewUserParams);
      return response.status(200).send({
        status: "success",
        data: loginUser,
      });
    } catch (e) {
      throw e;
    }
  }

  @Get("/auth-test")
  @UseBefore(AuthMiddleware)
  async authTest(@Res() response: any, @Req() request: any) {
   
    try {
      response.send({
        status: "success",
        data: "auth working",
      });
    } catch (error) {
      throw error;
    }
  }

  @Get("/logout")
  async logoutUser(@Res() response: any, @Req() request: any) {
    const deviceId = request.headers["deviceId"];
    if (!deviceId) {
      response.status(401).send("Device id  is required for authentication");
    }
    const renewTokens = await this.userService.logout(deviceId);
    try {
      response.send({
        status: "success",
        data: "auth working",
      });
    } catch (error) {
      throw error;
    }
  }
}
