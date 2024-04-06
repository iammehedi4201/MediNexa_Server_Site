import {
  BloodGroup,
  DoctorDepartment,
  UserGender,
  UserStatus,
} from "@prisma/client";
import z from "zod";

const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string(),
    gender: z.enum(Object.values(UserGender) as [string, ...string[]]),
    email: z.string(),
    contactNo: z.string(),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: z.object({
    name: z.string(),
    email: z.string().email(),
    gender: z.enum(Object.values(UserGender) as [string, ...string[]]),
    contactNo: z.string(),
    profileImage: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string(),
    experience: z.number().int().nonnegative().optional(),
    appointmentFee: z.number().int().nonnegative(),
    qualification: z.string(),
    currentWorkPlace: z.string(),
    designation: z.string(),
    department: z.enum(
      Object.values(DoctorDepartment) as [string, ...string[]]
    ),
    averageRating: z.number().nonnegative(),
    isDeleted: z.boolean().default(false),
  }),
});

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    id: z.string(),
    userId: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    age: z.number().int().nonnegative(),
    gender: z.enum(Object.values(UserGender) as [string, ...string[]]),
    bloodGroup: z.enum(Object.values(BloodGroup) as [string, ...string[]]),
    contactNo: z.string(),
    address: z.string(),
    profileImage: z.string().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updateUserProfileStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(UserStatus) as [string, ...string[]]),
  }),
});

export const userValidation = {
  createAdminValidationSchema,
  createDoctorValidationSchema,
  createPatientValidationSchema,
  updateUserProfileStatusValidationSchema,
};
