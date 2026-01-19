import userService from "../services/userService.js";

/**
 * User Controller
 * Handles user HTTP requests
 */
class UserController {
  /**
   * Get all users
   * GET /api/users
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
        message: "Users fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllUsersByRole(req, res, next) {
    try {
      console.log(req.params.role);
      const users = await userService.getAllUsersByRole(req.params.role);

      console.log(users);

      res.status(200).json({
        success: true,
        data: users,
        message: "Users fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upgrade user to Expert
   * POST /api/users/upgrade-expert
   */
  async upgradeToExpert(req, res, next) {
    try {
      const userId = req.user.id; // From authMiddleware
      const { bio, specialization, hourlyRate } = req.body;

      // Basic validation
      if (!specialization || !hourlyRate) {
        return res.status(400).json({
          success: false,
          message: "Specialization and Hourly Rate are required",
        });
      }

      const result = await userService.upgradeToExpert(userId, {
        bio,
        specialization,
        hourlyRate,
      });

      res.status(200).json({
        success: true,
        message: "Upgraded to Expert successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Expert Profile
   * PUT /api/users/expert-profile
   */
  async updateExpertProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        bio,
        specialization,
        hourlyRate,
        videoUrl,
        gallery,
        socialLinks,
      } = req.body;

      const updatedProfile = await userService.updateExpertProfile(userId, {
        bio,
        specialization,
        hourlyRate,
        videoUrl,
        gallery,
        socialLinks,
      });

      res.status(200).json({
        success: true,
        message: "Expert profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
