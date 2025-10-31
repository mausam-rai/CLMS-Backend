import { createActivity, getAllActivities, getActivity, updateActivity, deleteActivity } from "../Controllers/Activity.Contollers.js";
import { Router } from "express";
import isAuthenticated from "../Middleware/auth.middleware.js";

const router= Router();

router.route('/create').post(isAuthenticated, createActivity);
router.route('/getAll').get(isAuthenticated, getAllActivities);
router.route('/single/:id').get(isAuthenticated, getActivity);
router.route('/update/:id').patch(isAuthenticated, updateActivity);
router.route('/delete/:id').delete(isAuthenticated, deleteActivity);

export default router;