
import { UserStatus } from "@prisma/client";
import { generateToken, verifyToken } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";

import config from "../../config";

const login = async (payload: { email: string; password: string }) => {

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  console.log("user", user);


  if (!user) {
    throw new Error("User not found!");
  }

  const isCorrectPass = await bcrypt.compare(payload.password, user.password);
  if (!isCorrectPass) {
    throw new Error("Password does not match!");
  }


  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  
  const accessToken = generateToken(jwtPayload,config.jwt.jwt_secret,config.jwt.expires_in);
  
  console.log("🔹 LOGIN ACCESS SECRET:", config.jwt.jwt_secret);
  console.log("🔹 LOGIN REFRESH SECRET:", config.jwt.refresh_token_secret);
  console.log("🔹 GENERATED ACCESS TOKEN:", accessToken);

  const refreshToken = generateToken(jwtPayload,config.jwt.refresh_token_secret,config.jwt.refresh_token_expires_in);
  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};



export const refreshToken = async (token: string) => {
  let decodedData;

  try {
  
    decodedData = await verifyToken(token, config.jwt.jwt_secret);
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  if (!decodedData || !decodedData.email) {
    throw new Error("Invalid token payload!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  if (userData.status !== UserStatus.ACTIVE) {
    throw new Error("User is not active!");
  }

  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateToken(jwtPayload, config.jwt.jwt_secret, config.jwt.expires_in);

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};


const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email,
            status:UserStatus.ACTIVE










        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};

export const AuthServices = { login , refreshToken, changePassword};
