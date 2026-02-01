import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get(
  "/",
  authMiddleware,
  userController.getAllUsers.bind(userController),
);
router.post(
  "/upgrade-expert",
  authMiddleware,
  userController.upgradeToExpert.bind(userController),
);
router.put(
  "/expert-profile",
  authMiddleware,
  userController.updateExpertProfile.bind(userController),
);
router.get(
  "/role/:role",
  // Public access allowed for listing experts
  // authMiddleware, 
  userController.getAllUsersByRole.bind(userController),
);
router.get(
  "/:id",
  // Public access allowed for viewing public profiles
  // authMiddleware,
  userController.getUserById.bind(userController),
);
router.put(
  "/:id/role",
  authMiddleware,
  userController.updateUserRole.bind(userController),
);
export default router;
