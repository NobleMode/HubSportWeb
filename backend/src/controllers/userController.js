import userService from '../services/userService.js';

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
        message: 'Users fetched successfully',
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
        message: 'Users fetched successfully',
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
}

export default new UserController();
