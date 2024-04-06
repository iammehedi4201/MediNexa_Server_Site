import pick from "../../../Shared/Pick";
import catchAsync from "../../../Shared/catchAynsc";
import sendResponse from "../../../Shared/sendResponse";
import {
  optionsFields,
  userFilterAbleFields,
  userSearchAbleFields,
} from "./user.constant";
import { userService } from "./user.service";

//! Create Admin to DB
const createAdminToDB = catchAsync(async (req, res) => {
  const file = req.file;
  const data = req.body;
  const result = await userService.createAdminToDB(file, data);
  console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Admin created successfully",
    data: result,
  });
});

//! Create Doctor to DB
const createDoctorToDB = catchAsync(async (req, res) => {
  const file = req.file;
  const data = req.body;
  const result = await userService.createDoctorToDB(file, data);
  console.log(result);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Doctor created successfully",
    data: result,
  });
});

//! Create Patitent to DB
const createPatitentToDB = catchAsync(async (req, res) => {
  const file = req.file;
  const data = req.body;
  const result = await userService.createPatitentToDB(file, data);
  console.log(result);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Patitent created successfully",
    data: result,
  });
});

//! Get All Users
const getAllUsersFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterAbleFields);
  const options = pick(req.query, optionsFields);

  console.log("filters", filters);

  const result = await userService.getAllUsersFromDB(filters, options as any);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All users fetched successfully",
    data: result,
  });
});

//! Get Single User

//! Update User Profile Status
const updateUserProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await userService.updateUserProfileStatus(id, status);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User profile status updated successfully",
    data: result,
  });
});

export const userController = {
  createAdminToDB,
  createDoctorToDB,
  createPatitentToDB,
  getAllUsersFromDB,
  updateUserProfileStatus,
};
