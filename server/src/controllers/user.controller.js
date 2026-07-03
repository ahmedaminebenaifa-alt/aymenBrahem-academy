import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
});

export const addUser = asyncHandler(async (req, res) => {
  const newUser = await userService.createUser(req.body);
  res.status(201).json({
    status: 'success',
    message: 'تم إنشاء الحساب بنجاح وتخزينه في قاعدة البيانات',
    data: newUser
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await userService.deleteUserById(id);
  res.status(200).json({
    status: 'success',
    message: result.message
  });
});