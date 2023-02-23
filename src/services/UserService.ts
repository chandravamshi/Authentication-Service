import { Service } from "typedi";

import crypto from "crypto";
import { prisma } from "../index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Service()
export class UserService {
  // create new user
  async createUser(newUser: any): Promise<any> {
    //Check if user already exist by email
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: newUser.email,
        },
      });

      if (user !== null) {
        throw new Error("User alread exist");
      }

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const createNewUser = await prisma.users.create({
        data: {
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          password: hashedPassword,
          uid: crypto.randomUUID(),
        },
      });

      return createNewUser;
    } catch (error) {
      throw error;
    }
  }

  // create new user
  async loginUser(userDetails: any): Promise<any> {
    //Check if user already exist by email
    console.log(userDetails);
    try {
      const loginUser = await prisma.users.findUnique({
        where: {
          email: userDetails.email,
        },
      });

      //compare the password
      if (loginUser) {
        const email = userDetails.email;
        if (await bcrypt.compare(userDetails.password, loginUser.password)) {
          // Create token
          const accessToken = jwt.sign(
            { userId: loginUser.id, email },
            "secret",
            {
              expiresIn: 300,
            }
          );

          const refreshToken = jwt.sign(
            { userId: loginUser.id, email },
            "secret",
            {
              expiresIn: "1y",
            }
          );

          const accessTokenExpiresIn = jwt.verify(accessToken, "secret").exp;
          //console.log(accessTokenExpiresIn);
          //console.log(loginUser.id)

          try {
            const session = await prisma.sessions.create({
              data: {
                userId: loginUser.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                deviceId: crypto.randomUUID(),
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
          } catch (error) {
            throw error;
          }
          /**const userWithToken = {
            user: loginUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
            data:upsertUser
            //deviceId: deviceId
          };**/
        } else {
          throw new Error("Invalid Credentials");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(token: any): Promise<any> {
    try {
      const userTokneDetails = await prisma.sessions.findUniqueOrThrow({
        where: {
          accessToken: token,
        },
      });
      return userTokneDetails;
    } catch (error) {
      throw error;
    }
  }

  async updateSession(rToken: string, deviceId: string): Promise<any> {
    try {
      const userTokneDetails = await prisma.sessions.findFirstOrThrow({
        where: {
          refreshToken: rToken,
          deviceId: deviceId,
        },
        include: {
          user: true,
        },
      });

      if (!userTokneDetails.valid) {
        await prisma.sessions.deleteMany({
          where: {
            userId: userTokneDetails.user.id,
          },
        });
        throw new Error("you were logged out of all devices.");
      }

      console.log(userTokneDetails);

      const userEmail = userTokneDetails.user.email;

      const accessToken = jwt.sign(
        { userId: userTokneDetails.user.id, userEmail },
        "secret",
        {
          expiresIn: 300,
        }
      );

      const refreshToken = jwt.sign(
        { userId: userTokneDetails.user.id, userEmail },
        "secret",
        {
          expiresIn: "1y",
        }
      );

      const accessTokenExpiresIn = jwt.verify(accessToken, "secret").exp;

      const session = await prisma.sessions.create({
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

      const updateLastRefreshToken = await prisma.sessions.update({
        where: {
          id: userTokneDetails.id,
        },
        data: {
          lastUse: new Date(),
          valid: false,
        },
      });

      return session;
    } catch (error) {
      throw error;
    }
  }

  async logout(deviceId: string): Promise<any> {
    try {
      const deleteSessionTokens = await prisma.sessions.deleteMany({
        where: {
          deviceId: deviceId,
        },
      });
      return deleteSessionTokens;
    } catch (error) {
      throw error;
    }
  }
}
