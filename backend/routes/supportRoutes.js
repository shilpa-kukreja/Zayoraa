import express from 'express';
import { createSupport, getAllSupport, updateSupportStatus } from '../controllers/supportController.js';

const router = express.Router();

router.post('/', createSupport);
router.get('/', getAllSupport);          // Admin: get all
router.put('/:id', updateSupportStatus); // Admin: update status

export default router;