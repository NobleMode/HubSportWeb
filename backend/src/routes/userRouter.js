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
  authMiddleware,
  userController.getAllUsersByRole.bind(userController),
);
router.get(
  "/:id",
  authMiddleware,
  userController.getUserById.bind(userController),
);
export default router;
