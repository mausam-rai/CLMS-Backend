import isAuthenticated from "../Middleware/auth.middleware.js";
import isSuperAdmin from "../Middleware/isSuperAdmin.middleware.js"
import { createProject, getAllProjects, getProject, getMyProjects, deleteProject, updateProject } from "../Controllers/Project.Controllers.js";
import { Router } from "express";


const router=Router();


router.route('/create').post( isAuthenticated, createProject);
router.route('/update/:id').patch(isAuthenticated, updateProject);
router.route('/delete/:id').delete(isAuthenticated, isSuperAdmin, deleteProject);
router.route('/all').get(isAuthenticated, getAllProjects);
router.route('/single/:id').get(isAuthenticated, getProject);
router.route('/myProject').get(isAuthenticated, getMyProjects);

export default router;