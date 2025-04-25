import { NextFunction, Request, Response } from "express";
import { userService } from "./user.sevice";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.const";
import { IFile, IUser } from "../../interfaces/file";
const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const result = await userService.createAdminIntoDB(req, next);
        
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin Created successfully!",
            data: result,
          });
})

const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await userService.createDoctorIntoDB(req,next);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Created successfully!",
        data: result
    })
});

const createPatient = catchAsync(async (req: Request, res: Response,next: NextFunction) => {

    const result = await userService.createPatientIntoDB(req,next);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Created successfully!",
        data: result
    })
});

const getAllFromDB = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
const filters = pick(req.query, userFilterableFields);
const options = pick(req.query, ["sortBy","sortOrder", "limit", "page"])

    const result = await userService.getAllFromDB(filters,options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all user data successfully!",
        data: result
    })
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await userService.changeProfileStatus(id, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile status changed successfully!",
        data: result
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
    const user = req.user as IUser;
    const result = await userService.getMyProfile(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get user profile info!",
        data: result
    })
})

const updateMyProfile = catchAsync(async (req:any , res: Response,next:NextFunction) => {

    const result = await userService.updateMyProfile(req,next);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});

export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}