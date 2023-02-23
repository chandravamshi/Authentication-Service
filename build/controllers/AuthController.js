"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const RenewRefreshTokenMiddelware_1 = require("../middlewares/RenewRefreshTokenMiddelware");
const ValidationErrors_1 = require("../middlewares/ValidationErrors");
const UserService_1 = require("../services/UserService");
let AuthController = class AuthController {
    constructor(userService) {
        this.userService = userService;
    }
    authTest(response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.send({
                    status: "success",
                    data: "auth validated",
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    renewTokens(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rToken = request.headers["refresh-token"];
                const deviceId = request.headers["device-id"];
                const renewTokens = yield this.userService.updateSession(rToken, deviceId);
                response.send({
                    status: "success",
                    data: renewTokens,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
};
__decorate([
    (0, routing_controllers_1.Get)("/validate-auth"),
    (0, routing_controllers_1.UseBefore)(AuthMiddleware_1.AuthMiddleware),
    __param(0, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authTest", null);
__decorate([
    (0, routing_controllers_1.Get)("/renew-tokens"),
    (0, routing_controllers_1.UseBefore)(RenewRefreshTokenMiddelware_1.RenewRefreshTokenMiddleware),
    (0, routing_controllers_1.UseAfter)(ValidationErrors_1.ValidationErrors),
    __param(0, (0, routing_controllers_1.Res)()),
    __param(1, (0, routing_controllers_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "renewTokens", null);
AuthController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/auth"),
    __metadata("design:paramtypes", [UserService_1.UserService])
], AuthController);
exports.AuthController = AuthController;
