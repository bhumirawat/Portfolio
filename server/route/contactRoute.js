import express from 'express';
import { submitContact, getContacts } from '../controller/contactController.js';

const router = express.Router();

router.post('/contact', submitContact);
router.get('/contacts', getContacts);

export default router;