import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcryptjs";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import sendEmail from "../../../helpars/sendEmail";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";

const jwtSecret = config.jwt.jwt_secret as Secret;
const jwtExpiresIn = config.jwt.expires_in as string;

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    jwtSecret,
    jwtExpiresIn
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_jwt_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, jwtSecret);
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    jwtSecret,
    jwtExpiresIn
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const hashedPassword = await bcrypt.hash(payload?.newPassword, 12);

  const changeUser = await prisma.user.update({
    where: {
      email: user?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return changeUser;
};

const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const token = jwtHelpers.generateToken(
    { email: userData?.email, role: userData?.role },
    config.reset_password.reset_pass_token as Secret,
    config.reset_password.reset_pass_expires_in as string
  );

  const link = `http://localhost:3000/reset-password?userId=${userData?.id}&token=${token}`;

  return await sendEmail(userData?.email, link);
};

const resetPassword = async (token:string, payload: {id:string, password:string}) => {
  
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload?.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(token,
    config.reset_password.reset_pass_token as Secret
  );

  if(!isValidToken){
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid user")
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12)
  
  const changeUser = await prisma.user.update({
    where: {
      email: userData?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return changeUser;
 
};


export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword
};
