import { createInstitute, getAllInstitute, getInstitute, updatedInstitute, deleteInstitute } from "../Controllers/Institutions.Controllers.js";
import { Router } from "express";
import isAuthenticated from "../Middleware/auth.middleware.js";


const router= Router();


router.route("/create").post(isAuthenticated, createInstitute);
router.route('/getAll').get(isAuthenticated, getAllInstitute);
router.route('/get/:id').get(isAuthenticated, getInstitute);
router.route('/update/:id').patch(isAuthenticated, updatedInstitute);
router.route('/delete/:id').delete(isAuthenticated, deleteInstitute)


export default router;