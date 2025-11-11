
import { UserStatus } from "@prisma/client";
import { generateToken, verifyToken } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  const accessToken = generateToken(jwtPayload,"abcdefg",'15m');

  const refreshToken = generateToken(jwtPayload,"abcdefg",'30d');
  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};



export const refreshToken = async (token: string) => {
  let decodedData;

  try {
  
    decodedData = await verifyToken(token, "abcdefg");
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

  const accessToken = generateToken(jwtPayload, "abcdefg", "15m");

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};


export const AuthServices = { login , refreshToken};
