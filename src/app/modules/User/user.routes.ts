import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helper/fileUploader";
import checkAuth from "../../middlewares/checkAuth";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import ValidateRequest from "../../middlewares/validateRequest";

const router = express.Router();

//! Create Admin
router.post(
  "/create-admin",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = JSON.parse(req.body.data);
    req.body = userValidation.createAdminValidationSchema.parse(data);

    //:  In Express.js, once a response is sent, you should not try to send another response or modify the res object. Returning the call to createAdminToDB ensures that the route handler exits immediately after createAdminToDB is called.
    return userController.createAdminToDB(req, res, next);
  }
);

//! Create Doctor
router.post(
  "/create-doctor",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = JSON.parse(req.body.data);
    req.body = userValidation.createDoctorValidationSchema.parse(data);
    return userController.createDoctorToDB(req, res, next);
  }
);

//! Create Patient
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = JSON.parse(req.body.data);
    req.body = userValidation.createPatientValidationSchema.parse(data);
    return userController.createPatitentToDB(req, res, next);
  }
);

//! Get All Users
router.get(
  "/",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  userController.getAllUsersFromDB
);

//! Get Single User

//! Update User Profile Status
router.patch(
  "/:id/status",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  ValidateRequest(userValidation.updateUserProfileStatusValidationSchema),
  userController.updateUserProfileStatus
);

export const userRoutes = router;
