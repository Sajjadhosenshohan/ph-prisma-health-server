import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../error/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED,"unauthorized user!");
    }

    const verifyTokenData = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as Secret
    );

    const checkRole = roles.some((role) => role === verifyTokenData.role);
    if (!checkRole) {
        throw new ApiError(httpStatus.UNAUTHORIZED,"unauthorized user!");
    }
    next();
  });
};

export default auth;
