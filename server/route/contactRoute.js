import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById
} from '../controller/contactController.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  console.log('✅ Contact route test successful');
  res.json({
    success: true,
    message: 'Contact routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Public route - anyone can submit contact form
router.post('/', createContact);

// Admin routes (public for demo - add authentication in production)
router.get('/', getAllContacts);
router.get('/:id', getContactById);

export default router;