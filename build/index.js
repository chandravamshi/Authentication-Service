"use strict";
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
exports.prisma = void 0;
// this shim is required
const routing_controllers_1 = require("routing-controllers");
const client_1 = require("@prisma/client");
require("reflect-metadata");
const typedi_1 = require("typedi");
const luxon_1 = require("luxon");
const UserController_1 = require("./controllers/UserController");
const AuthController_1 = require("./controllers/AuthController");
(0, routing_controllers_1.useContainer)(typedi_1.Container);
let compression = require("compression");
var morgan = require("morgan");
var cron = require("node-cron");
require("dotenv").config();
luxon_1.Settings.defaultZone = "utc";
// creates express app, registers all controller routes and returns you express app instance
const app = (0, routing_controllers_1.createExpressServer)({
    defaultErrorHandler: false,
});
(0, routing_controllers_1.useExpressServer)(app, {
    controllers: [UserController_1.UserController, AuthController_1.AuthController],
});
app.use(morgan(process.env.LOG_FORMAT || "common"));
app.use(compression());
exports.prisma = new client_1.PrismaClient();
//"0 0 1 */2 *"
cron.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("running a task every two months");
    const sessions = yield exports.prisma.sessions.findMany({
        where: { valid: true },
    });
    const deletedSessionUsers = [];
    for (var session of sessions) {
        var lastUsedDate = luxon_1.DateTime.fromJSDate(session.lastUse);
        var diffInMonths = luxon_1.DateTime.now()
            .diff(lastUsedDate, "months")
            .toObject().months;
        if (diffInMonths && Math.round(diffInMonths) > 2) {
            const deleteSessions = yield exports.prisma.sessions.deleteMany({
                where: {
                    deviceId: session.deviceId,
                },
            });
            if (deleteSessions) {
                deletedSessionUsers.push(session.userId);
            }
        }
    }
    console.log(deletedSessionUsers);
}));
app.listen(5000, () => {
    console.log("started server at port 5000");
});
