import { Admin, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../Shared/prisma";
import generatePaginationAndSortOptions from "../../../helper/paginationHelper";
import { Toptions } from "../../interfaces/paginationAndSortOptions";
import { adminSearchFields } from "./Admin.constant";

//! Get all admin users
const getAllAdminUsersFromDB = async (
  query: Record<string, unknown>,
  options: Toptions
) => {
  const conditions: Prisma.AdminWhereInput[] = [];
  const { searchTerm, ...filterData } = query;
  const { page, take, skip, sortBy, sortOrder } =
    generatePaginationAndSortOptions(options);

  //: if search term is provided
  if (query?.searchTerm) {
    conditions.push({
      OR: adminSearchFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //:Filter Data
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  //: Add isDeleted false condition
  conditions.push({
    isDeleted: false,
  });

  const result = await prisma.admin.findMany({
    where: conditions.length > 0 ? { AND: conditions } : {},
    take,
    skip,
    orderBy: {
      [String(sortBy)]: sortOrder,
    },
  });

  //:Total Data Count According to Filtering
  const totalData = await prisma.admin.count({
    where: {
      AND: conditions,
    },
  });

  //: return data with pagination
  return {
    page,
    take,
    totalData,
    data: result,
  };
};

//! Get user by id
const GetAdminUserById = async (id: string) => {
  const adminUser = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false, //: Check if user is soft deleted or not
    },
  });
  return adminUser;
};

//! Update user by id
const UpdateAdminUserById = async (id: string, payLoad: Partial<Admin>) => {
  //: Check if user exist or not throw error if not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false, //: Check if user is soft deleted or not
    },
  });

  //: Update user
  const updatedUser = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      ...payLoad,
    },
  });
  return updatedUser;
};

//! Delete user by id
const DeleteAdminUserById = async (id: string) => {
  //: Check if user exist or not throw error if not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  //: Delete admin data and user data
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: adminDeletedData?.email,
      },
    });
    return adminDeletedData;
  });
  return result;
};

//! soft delete user by id
const softDeleteAdminUserById = async (id: string) => {
  //: Check if user exist or not throw error if not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false, //: Check if user is soft deleted or not
    },
  });

  //: soft delete admin data and user data
  const result = await prisma.$transaction(async (transactionClient) => {
    //: soft delete admin data
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    //: soft delete user data
    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const adminService = {
  getAllAdminUsersFromDB,
  GetAdminUserById,
  UpdateAdminUserById,
  DeleteAdminUserById,
  softDeleteAdminUserById,
};
