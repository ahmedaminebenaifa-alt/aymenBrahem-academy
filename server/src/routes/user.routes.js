import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validateCreateUser, validateUpdateProfile, validateChangePassword } from '../validators/user.validator.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';
import { uploadImage, handleImageUploadError } from '../middleware/uploadImage.middleware.js';

const router = Router();

router.use(verifyAuth);

router.route('/')
  .get(requireRole('ADMIN'), userController.getUsers) 
  .post(requireRole('ADMIN'), validateCreateUser, userController.addUser);

router.patch('/me', validateUpdateProfile, userController.updateProfile);
router.patch('/me/password', validateChangePassword, userController.changePassword);
router.post(
  '/me/avatar',
  uploadImage.single('image'),
  handleImageUploadError,
  userController.uploadAvatar
);

router.route('/:id')
  .delete(requireRole('ADMIN'), userController.deleteUser);

export default router;