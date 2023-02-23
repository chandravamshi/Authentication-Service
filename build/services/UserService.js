"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typedi_1 = require("typedi");
const crypto_1 = __importDefault(require("crypto"));
const index_1 = require("../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UserService = class UserService {
    // create new user
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check if user already exist by email
            try {
                const user = yield index_1.prisma.users.findUnique({
                    where: {
                        email: newUser.email,
                    },
                });
                if (user !== null) {
                    throw new Error("User alread exist");
                }
                const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
                const createNewUser = yield index_1.prisma.users.create({
                    data: {
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        password: hashedPassword,
                        uid: crypto_1.default.randomUUID(),
                    },
                });
                return createNewUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // create new user
    loginUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check if user already exist by email
            console.log(userDetails);
            try {
                const loginUser = yield index_1.prisma.users.findUnique({
                    where: {
                        email: userDetails.email,
                    },
                });
                //compare the password
                if (loginUser) {
                    const email = userDetails.email;
                    if (yield bcrypt_1.default.compare(userDetails.password, loginUser.password)) {
                        // Create token
                        const accessToken = jsonwebtoken_1.default.sign({ userId: loginUser.id, email }, "secret", {
                            expiresIn: 300,
                        });
                        const refreshToken = jsonwebtoken_1.default.sign({ userId: loginUser.id, email }, "secret", {
                            expiresIn: "1y",
                        });
                        const accessTokenExpiresIn = jsonwebtoken_1.default.verify(accessToken, "secret").exp;
                        //console.log(accessTokenExpiresIn);
                        //console.log(loginUser.id)
                        try {
                            const session = yield index_1.prisma.sessions.create({
                                data: {
                                    userId: loginUser.id,
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    deviceId: crypto_1.default.randomUUID(),
                                    accessTokenExpiry: accessTokenExpiresIn,
                                    valid: true,
                                },
                            });
                            return session;
                            /**
                            const userToken = await prisma.userToken.create({
                              data: {
                                userId: loginUser.id,
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                              },
                            });**/
                        }
                        catch (error) {
                            throw error;
                        }
                        /**const userWithToken = {
                          user: loginUser,
                          accessToken: accessToken,
                          refreshToken: refreshToken,
                          data:upsertUser
                          //deviceId: deviceId
                        };**/
                    }
                    else {
                        throw new Error("Invalid Credentials");
                    }
                }
                else {
                    throw new Error("User not found");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokneDetails = yield index_1.prisma.sessions.findUniqueOrThrow({
                    where: {
                        accessToken: token,
                    },
                });
                return userTokneDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateSession(rToken, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokneDetails = yield index_1.prisma.sessions.findFirstOrThrow({
                    where: {
                        refreshToken: rToken,
                        deviceId: deviceId,
                    },
                    include: {
                        user: true,
                    },
                });
                if (!userTokneDetails.valid) {
                    yield index_1.prisma.sessions.deleteMany({
                        where: {
                            userId: userTokneDetails.user.id,
                        },
                    });
                    throw new Error("you were logged out of all devices.");
                }
                console.log(userTokneDetails);
                const userEmail = userTokneDetails.user.email;
                const accessToken = jsonwebtoken_1.default.sign({ userId: userTokneDetails.user.id, userEmail }, "secret", {
                    expiresIn: 300,
                });
                const refreshToken = jsonwebtoken_1.default.sign({ userId: userTokneDetails.user.id, userEmail }, "secret", {
                    expiresIn: "1y",
                });
                const accessTokenExpiresIn = jsonwebtoken_1.default.verify(accessToken, "secret").exp;
                const session = yield index_1.prisma.sessions.create({
                    data: {
                        userId: userTokneDetails.user.id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        deviceId: deviceId,
                        accessTokenExpiry: accessTokenExpiresIn,
                        valid: true,
                        lastRefreshToken: userTokneDetails.id,
                    },
                });
                const updateLastRefreshToken = yield index_1.prisma.sessions.update({
                    where: {
                        id: userTokneDetails.id,
                    },
                    data: {
                        lastUse: new Date(),
                        valid: false,
                    },
                });
                return session;
            }
            catch (error) {
                throw error;
            }
        });
    }
    logout(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteSessionTokens = yield index_1.prisma.sessions.deleteMany({
                    where: {
                        deviceId: deviceId,
                    },
                });
                return deleteSessionTokens;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)()
], UserService);
exports.UserService = UserService;
