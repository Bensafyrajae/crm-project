import express from 'express';
import { getManagerLeads, updateLeadStatus } from '../controllers/manager.controller.js';  
import { protect } from '../middleware/auth.js';
import { isManager } from '../middleware/role.js';

const router = express.Router();

// Appliquer le middleware à toutes les routes
router.use(protect);
router.use(isManager);

router.get('/leads', getManagerLeads);
router.patch('/leads/:id', updateLeadStatus);

// Exporter par défaut
export default router;
