import pick from "../../../Shared/Pick";
import catchAsync from "../../../Shared/catchAynsc";
import sendResponse from "../../../Shared/sendResponse";
import { adminFilterAbleFields, optionsFields } from "./Admin.constant";
import { adminService } from "./admin.service";

//! Get all users
const getAllAdminUsersFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, optionsFields);
  const result = await adminService.getAllAdminUsersFromDB(
    filters,
    options as any
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All users fetched successfully",
    meta: {
      page: result?.page,
      limit: result?.take,
      totalData: result?.totalData,
    },
    data: result?.data,
  });
});

//! Get user by id
const GetAdminUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.GetAdminUserById(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    data: result,
  });
});

//! update user by id
const UpdateAdminUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.UpdateAdminUserById(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfully",
    data: result,
  });
});

//! Delete user by id
const DeleteAdminUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.DeleteAdminUserById(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});

//! Soft Delete user by id
const softDeleteAdminUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.softDeleteAdminUserById(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdminUsersFromDB,
  GetAdminUserById,
  UpdateAdminUserById,
  DeleteAdminUserById,
  softDeleteAdminUserById,
};
