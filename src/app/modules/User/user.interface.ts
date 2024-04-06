import { Doctor, Patient, UserGender } from "@prisma/client";

export type TAdminUser = {
  password: string;
  admin: {
    name: string;
    gender: UserGender;
    email: string;
    contactNo: string;
    profileImage?: string;
  };
};

export type TDoctorUser = {
  password: string;
  doctor: Doctor;
};

export type TPatientUser = {
  password: string;
  patient: Patient;
};
