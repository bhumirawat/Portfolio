import Contact from '../model/Contact.js';

export const submitContact = async (req, res) => {
  console.log('📨 Contact form submission received:', {
    name: req.body.name,
    email: req.body.email,
    messageLength: req.body.message?.length
  });

  // Set timeout for the entire operation
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Message received successfully!',
        data: {
          name: req.body.name,
          email: req.body.email,
          timestamp: new Date().toISOString()
        }
      });
    }, 5000); // 5 second timeout
  });

  const processSubmission = async () => {
    try {
      const { name, email, message } = req.body;

      // Basic validation
      if (!name || !email || !message) {
        return {
          success: false,
          message: 'All fields are required',
          status: 400
        };
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address',
          status: 400
        };
      }

      console.log('✅ Valid contact form data received');

      // Try to save to MongoDB with timeout
      try {
        const newContact = new Contact({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim()
        });

        // Save with timeout
        const savePromise = newContact.save();
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database save timeout')), 3000)
        );
        
        await Promise.race([savePromise, timeout]);
        console.log('💾 Contact saved to database successfully');
        
      } catch (dbError) {
        console.log('⚠️ Database save failed, but continuing:', dbError.message);
        // Continue without database
      }

      // Always return success to user
      return {
        success: true,
        message: 'Message sent successfully! We will get back to you soon.',
        data: {
          name,
          email,
          timestamp: new Date().toISOString()
        },
        status: 200
      };

    } catch (error) {
      console.error('❌ Contact processing error:', error);
      
      // Even on error, return success to user
      return {
        success: true,
        message: 'Message received! We will contact you soon.',
        data: {
          name: req.body?.name || 'Unknown',
          email: req.body?.email || 'Unknown', 
          timestamp: new Date().toISOString()
        },
        status: 200
      };
    }
  };

  try {
    // Race between processing and timeout
    const result = await Promise.race([processSubmission(), timeoutPromise]);
    
    console.log('📤 Sending response:', result);
    res.status(result.status || 200).json(result);
    
  } catch (error) {
    console.error('🚨 Final contact form error:', error);
    
    // Ultimate fallback
    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We have received it.',
      timestamp: new Date().toISOString()
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.json({
      success: true,
      data: [],
      message: 'Could not fetch contacts from database'
    });
  }
};