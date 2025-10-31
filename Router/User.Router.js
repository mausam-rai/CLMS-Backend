import { login, getAllUsers, getUser, createUser, updateProfile, SuperAdmin, deleteUser, logout } from "../Controllers/User.Controllers.js";
import express, { Router } from "express";
import isAuthenticated from "../Middleware/auth.middleware.js";
import isSuperAdmin from "../Middleware/isSuperAdmin.middleware.js";


const router =Router();


router.route('/setup/superadmin').post(SuperAdmin);
router.route('/login').post(login);
router.route('/user/:id').get(isAuthenticated, getUser);
router.route('/users').get(isAuthenticated, isSuperAdmin, getAllUsers);
router.route('/createUser').post(isAuthenticated, isSuperAdmin, createUser);
router.route('/updateProfile/:id').patch(isAuthenticated, updateProfile);
router.route('/delete/:id').delete(isAuthenticated, isSuperAdmin, deleteUser)
router.route('/logout').get(logout)

export default router;
