import { createLead, getAllLead, getLead, updateLead, deleteLead } from "../Controllers/Lead.Controllers.js";
import { Router } from "express";
import isAuthenticated from "../Middleware/auth.middleware.js";


const router=Router();

router.route('/create').post(isAuthenticated, createLead);
router.route('/Viewall').get(isAuthenticated, getAllLead);
router.route('/get/:id').get(isAuthenticated, getLead);
router.route('/update/:id').patch(isAuthenticated, updateLead);
router.route('/delete/:id').delete(isAuthenticated, deleteLead);


export default router;