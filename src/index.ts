// this shim is required
import {
  Action,
  createExpressServer,
  useContainer,
  useExpressServer,
} from "routing-controllers";
import { PrismaClient } from "@prisma/client";
import "reflect-metadata";
import { Container } from "typedi";
import { DateTime, Settings } from "luxon";
import { UserController } from "./controllers/UserController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { AuthController } from "./controllers/AuthController";
useContainer(Container);
let compression = require("compression");
var morgan = require("morgan");
var cron = require("node-cron");
require("dotenv").config();
Settings.defaultZone = "utc";

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  defaultErrorHandler: false,
});

useExpressServer(app, {
  controllers: [UserController, AuthController],
});

app.use(morgan(process.env.LOG_FORMAT || "common"));
app.use(compression());

export const prisma = new PrismaClient();

//"0 0 1 */2 *"
cron.schedule("* * * * *", async () => {
  console.log("running a task every one minute");
  const sessions = await prisma.sessions.findMany({
    where: { valid: true },
  });

  const deletedSessionUsers = [];
  for (var session of sessions) {
    var lastUsedDate = DateTime.fromJSDate(session.lastUse);
    var diffInMonths = DateTime.now()
      .diff(lastUsedDate, "months")
      .toObject().months;

    if (diffInMonths && Math.round(diffInMonths) > 2) {
      const deleteSessions = await prisma.sessions.deleteMany({
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
});

app.listen(5000, () => {
  console.log("started server at port 5000");
});
