import { Request, Response } from "express";
import { userService } from "./user.sevice";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const createAdmin = catchAsync(async (req: Request, res: Response) => {

        const result = await userService.createAdmin(req);
        
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin Created successfully!",
            data: result,
          });
})

export const userController = {
    createAdmin
}