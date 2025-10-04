import Contact from '../model/Contact.js';

// Create new contact message
export const createContact = async (req, res) => {
  console.log('🔍 CONTROLLER: createContact called');
  console.log('📦 Request body:', req.body);
  
  try {
    const { name, email, message } = req.body;

    // Check for missing fields
    if (!name || !email || !message) {
      console.log('❌ Missing fields detected:', { name, email, message });
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required: name, email, and message' 
      });
    }

    console.log('✅ All fields present, creating contact...');

    // Create new contact
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    console.log('✅ Contact created successfully:', contact._id);

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
    console.error('❌ CONTROLLER ERROR:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('❌ Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(', ')}`
      });
    }
    
    if (error.code === 11000) {
      console.error('❌ Duplicate key error');
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
    console.log('🔍 CONTROLLER: getAllContacts called');
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    console.log(`✅ Found ${contacts.length} contacts`);

    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });

  } catch (error) {
    console.error('❌ Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
};

// Get single contact message
export const getContactById = async (req, res) => {
  try {
    console.log('🔍 CONTROLLER: getContactById called with id:', req.params.id);
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      console.log('❌ Contact not found for id:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    console.log('✅ Contact found:', contact._id);
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message'
    });
  }
};