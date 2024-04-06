import { Prisma, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../Shared/prisma";
import { fileUploader } from "../../../helper/fileUploader";
import { userSearchAbleFields } from "./user.constant";
import { TAdminUser, TDoctorUser, TPatientUser } from "./user.interface";
import generatePaginationAndSortOptions from "../../../helper/paginationHelper";
import AppError from "../../../helper/errorHelper/appError";
import httpStatus from "http-status";

//! Create Admin to DB
const createAdminToDB = async (file: any, payLoad: TAdminUser) => {
  //:hash password
  const hashedPassword = await bcrypt.hash(payLoad.password, 10);
  //:userData
  const userData = {
    email: payLoad?.admin?.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  //: check if file is present
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payLoad.admin.profileImage = secure_url as string;
  }

  //: transaction to create admin and user
  const result = await prisma.$transaction(async (transactionClient) => {
    //: create new user
    const createNewUser = await transactionClient.user.create({
      data: userData,
    });

    //: create new admin
    const createNewAdmin = await transactionClient.admin.create({
      data: payLoad?.admin,
    });

    //:add password to password History table
    await transactionClient.passwordHistory.create({
      data: {
        password: hashedPassword,
        userId: createNewUser.id,
      },
    });

    return createNewAdmin;
  });

  return result;
};

//! Create Doctor to DB
const createDoctorToDB = async (file: any, payLoad: TDoctorUser) => {
  //:hash password
  const hashedPassword = await bcrypt.hash(payLoad.password, 10);
  //:userData
  const userData = {
    email: payLoad?.doctor?.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  //: check if file is present
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payLoad.doctor.profileImage = secure_url as string;
  }

  //: transaction to create admin and user
  const result = await prisma.$transaction(async (transactionClient) => {
    //: create new user
    const createNewUser = await transactionClient.user.create({
      data: userData,
    });

    //: create new  Doctor
    const createNewDoctor = await transactionClient.doctor.create({
      data: payLoad?.doctor,
    });

    //:add password to password History table
    await transactionClient.passwordHistory.create({
      data: {
        password: hashedPassword,
        userId: createNewUser.id,
      },
    });

    return createNewDoctor;
  });

  return result;
};

//! Create Patitent to DB
const createPatitentToDB = async (file: any, payLoad: TPatientUser) => {
  //:hash password
  const hashedPassword = await bcrypt.hash(payLoad.password, 10);
  //:userData
  const userData = {
    email: payLoad?.patient?.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  //: check if file is present
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payLoad.patient.profileImage = secure_url as string;
  }

  //: transaction to create admin and user
  const result = await prisma.$transaction(async (transactionClient) => {
    //: create new user
    const createNewUser = await transactionClient.user.create({
      data: userData,
    });

    //: create new Patitent
    const createNewPatitent = await transactionClient.patient.create({
      data: payLoad?.patient,
    });

    //:add password to password History table
    await transactionClient.passwordHistory.create({
      data: {
        password: hashedPassword,
        userId: createNewUser.id,
      },
    });

    return createNewPatitent;
  });

  return result;
};

//! Get All Users
const getAllUsersFromDB = async (
  query: Record<string, unknown>,
  options: {
    limit: number;
    page: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }
) => {
  const conditions: Prisma.UserWhereInput[] = [];
  const { searchTerm, ...filterData } = query;
  const { page, skip, sortBy, sortOrder, take } =
    generatePaginationAndSortOptions(options);

  //: if search term is provided
  if (query?.searchTerm) {
    conditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  conditions.push({
    status: "ACTIVE",
  });

  console.dir(conditions, { depth: Infinity });

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

  const result = await prisma.user.findMany({
    where: conditions.length > 0 ? { AND: conditions } : {},
    take,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      Admin: true,
      Doctor: true,
      Patient: true,
    },
  });

  return result;
};

//! Get single user by id

//! Update user Profile status
const updateUserProfileStatus = async (userId: string, status: UserStatus) => {
  //:check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  //:update user status
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
  });
};

export const userService = {
  createAdminToDB,
  createDoctorToDB,
  createPatitentToDB,
  getAllUsersFromDB,
  updateUserProfileStatus,
};
