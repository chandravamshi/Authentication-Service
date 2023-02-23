"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.RenewRefreshTokenMiddleware = void 0;
const typedi_1 = require("typedi");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const UserService_1 = require("../services/UserService");
let RenewRefreshTokenMiddleware = class RenewRefreshTokenMiddleware {
    // interface implementation is optional
    constructor(userService) {
        this.userService = userService;
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    const decoded = jsonwebtoken_1.default.verify(rToken, "secret");
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
                }
                catch (err) {
                    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                        res.send("Token Expired");
                    }
                    else {
                        res.send("Invalid Token");
                    }
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
};
RenewRefreshTokenMiddleware = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [UserService_1.UserService])
], RenewRefreshTokenMiddleware);
exports.RenewRefreshTokenMiddleware = RenewRefreshTokenMiddleware;
