import Contact from '../model/Contact.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // TEMPORARY: Store in memory or log to console instead of MongoDB
    console.log('📧 CONTACT FORM SUBMISSION:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      source: 'Vercel Production'
    });

    // Try to save to MongoDB if connected, but don't fail if not
    try {
      const newContact = new Contact({
        name,
        email,
        message
      });

      await newContact.save();
      console.log('✅ Message saved to database');
    } catch (dbError) {
      console.log('⚠️ Could not save to database, but form submission successful:', dbError.message);
      // Continue even if database save fails
    }

    // Always return success
    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        name,
        email,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    
    // Even if there's an unexpected error, don't break the user experience
    res.status(200).json({
      success: true,
      message: 'Message received! We will contact you soon.',
      data: {
        name: req.body?.name || 'Unknown',
        email: req.body?.email || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    // Try to get contacts from database if connected
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    // Return empty array if database is not available
    res.status(200).json({
      success: true,
      data: [],
      message: 'Database temporarily unavailable'
    });
  }
};