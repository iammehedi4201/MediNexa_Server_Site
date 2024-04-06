import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

//! Get all users
router.get(
  "/",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  adminController.getAllAdminUsersFromDB
);

//! Update,Get and Delete user by id
router
  .route("/:id")
  //: Get user by id
  .get(checkAuth("ADMIN", "SUPER_ADMIN"), adminController.GetAdminUserById)
  //: Update user by id
  .patch(
    checkAuth("ADMIN", "SUPER_ADMIN"),
    validateRequest(adminValidationSchema.adminInfoUpdateSchema),
    adminController.UpdateAdminUserById
  )
  //: Delete user by id
  .delete(
    checkAuth("ADMIN", "SUPER_ADMIN"),
    adminController.DeleteAdminUserById
  );

//! Soft Delete user by id
router.delete(
  "/soft-delete/:id",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  adminController.softDeleteAdminUserById
);

export const adminRoutes = router;
