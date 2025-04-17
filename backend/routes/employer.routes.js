import express from 'express';
import {
  getDashboardStats,
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/employer.controller.js'; // Utilisation de l'export ESModule
import { protect } from '../middleware/auth.js';
import { isEmployer } from '../middleware/role.js';

const router = express.Router();

// Appliquer les middleware à toutes les routes
router.use(protect);
router.use(isEmployer);

// Routes du tableau de bord
router.get('/dashboard-stats', getDashboardStats);

// Routes pour les managers
router.route('/managers')
  .get(getManagers)
  .post(createManager);

router.route('/managers/:managerId')
  .put(updateManager)
  .delete(deleteManager);

// Routes pour les leads
router.route('/leads')
  .get(getLeads)
  .post(createLead);

router.route('/leads/:leadId')
  .put(updateLead)
  .delete(deleteLead);

export default router;
