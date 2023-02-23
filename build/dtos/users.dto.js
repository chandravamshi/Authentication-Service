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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReqRegisterUser = exports.ReqLoginUser = void 0;
const class_validator_1 = require("class-validator");
class ReqLoginUser {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "parameter email should not be empty" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ReqLoginUser.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "parameter password should not be empty" }),
    (0, class_validator_1.IsString)({ message: "parameter password should be string" }),
    __metadata("design:type", String)
], ReqLoginUser.prototype, "password", void 0);
exports.ReqLoginUser = ReqLoginUser;
class ReqRegisterUser extends ReqLoginUser {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "parameter firstName should be string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "parameter firstName is needed" }),
    __metadata("design:type", String)
], ReqRegisterUser.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "parameter lastName should be string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "parameter lastName is needed" }),
    __metadata("design:type", String)
], ReqRegisterUser.prototype, "lastName", void 0);
exports.ReqRegisterUser = ReqRegisterUser;
