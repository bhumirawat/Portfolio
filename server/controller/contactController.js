import Contact from '../model/Contact.js';

// Create new contact message
export const createContact = async (req, res) => {
  
  try {
    const { name, email, message } = req.body;

    // Check for missing fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required: name, email, and message' 
      });
    }


    // Create new contact
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });


    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('CONTROLLER ERROR:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(', ')}`
      });
    }
    
    if (error.code === 11000) {
      console.error('Duplicate key error');
      return res.status(400).json({
        success: false,
        message: 'A contact with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again.'
    });
  }
};

// Get all contact messages (for admin view)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');


    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
};

// Get single contact message
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message'
    });
  }
};