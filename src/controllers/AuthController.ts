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
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RenewRefreshTokenMiddleware } from "../middlewares/RenewRefreshTokenMiddelware";
import { ValidationErrors } from "../middlewares/ValidationErrors";

import { UserService } from "../services/UserService";

@Service()
@JsonController("/auth")
export class AuthController {
  constructor(private userService: UserService) {}

  @Get("/validate-auth")
  @UseBefore(AuthMiddleware)
  async authTest(@Res() response: any) {
    try {
      response.send({
        status: "success",
        data: "auth validated",
      });
    } catch (error) {
      throw error;
    }
  }

  @Get("/renew-tokens")
  @UseBefore(RenewRefreshTokenMiddleware)
  @UseAfter(ValidationErrors)
  async renewTokens(@Res() response: any, @Req() request: any) {
    try {
      const rToken = request.headers["refresh-token"];
      const deviceId = request.headers["device-id"];
      const renewTokens = await this.userService.updateSession(
        rToken,
        deviceId
      );
      response.send({
        status: "success",
        data: renewTokens,
      });
    } catch (error) {
      throw error;
    }
  }
}
