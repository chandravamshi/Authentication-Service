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
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const users_dto_1 = require("../dtos/users.dto");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const ValidationErrors_1 = require("../middlewares/ValidationErrors");
const UserService_1 = require("../services/UserService");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    // create new user
    createNewUser(createNewUserParams, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createNewUser = yield this.userService.createUser(createNewUserParams);
                // console.log(createNewUser);
                return response.status(200).send({
                    status: "success",
                    data: createNewUser,
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    //  login user
    loginUser(createNewUserParams, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginUser = yield this.userService.loginUser(createNewUserParams);
                return response.status(200).send({
                    status: "success",
                    data: loginUser,
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    authTest(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.send({
                    status: "success",
                    data: "auth working",
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    logoutUser(response, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = request.headers["deviceId"];
            if (!deviceId) {
                response.status(401).send("Device id  is required for authentication");
            }
            const renewTokens = yield this.userService.logout(deviceId);
            try {
                response.send({
                    status: "success",
                    data: "auth working",
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)("/create-user"),
    (0, routing_controllers_1.UseAfter)(ValidationErrors_1.ValidationErrors)
    // @UseBefore(AuthMiddleware)
    ,
    __param(0, (0, routing_controllers_1.Body)({
        validate: {
            whitelist: true,
            forbidNonWhitelisted: true,
            validationError: { target: false, value: false },
        },
    })),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.ReqRegisterUser, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createNewUser", null);
__decorate([
    (0, routing_controllers_1.Post)("/login-user"),
    (0, routing_controllers_1.UseAfter)(ValidationErrors_1.ValidationErrors)
    //@UseAfter(AuthMiddleware)
    ,
    __param(0, (0, routing_controllers_1.Body)({
        validate: {
            whitelist: true,
            forbidNonWhitelisted: true,
            validationError: { target: false, value: false },
        },
    })),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.ReqLoginUser, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    (0, routing_controllers_1.Get)("/auth-test"),
    (0, routing_controllers_1.UseBefore)(AuthMiddleware_1.AuthMiddleware),
    __param(0, (0, routing_controllers_1.Res)()),
    __param(1, (0, routing_controllers_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "authTest", null);
__decorate([
    (0, routing_controllers_1.Get)("/logout"),
    __param(0, (0, routing_controllers_1.Res)()),
    __param(1, (0, routing_controllers_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logoutUser", null);
UserController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/user"),
    __metadata("design:paramtypes", [UserService_1.UserService])
], UserController);
exports.UserController = UserController;
