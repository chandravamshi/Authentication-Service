"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrors = void 0;
const typedi_1 = require("typedi");
let ValidationErrors = class ValidationErrors {
    error(error, request, res, next) {
        if (error) {
            const responseObject = {};
            responseObject.errors = error;
            responseObject.message = error.message
                ? error.message
                : "You have an error in your request's body. Check 'errors' field for more details!";
            //responseObject.cm = error.message
            //responseObject.status = 0;
            //responseObject.data = {};
            //responseObject.data.message = [];
            // error.errors.forEach((element: ValidationError) => {
            //     Object.keys(element.constraints).forEach((type) => {
            //         responseObject.data.message.push(`property ${element.constraints[type]}`);
            //     });
            // });
            res.send(responseObject);
        }
    }
};
ValidationErrors = __decorate([
    (0, typedi_1.Service)()
], ValidationErrors);
exports.ValidationErrors = ValidationErrors;
