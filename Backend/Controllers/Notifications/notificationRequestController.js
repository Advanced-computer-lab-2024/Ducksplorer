const NotificationRequest = require('../../Models/notificationRequestModel');

const requestNotification = async (req, res) => {
  const { user, eventId } = req.body; // Assuming userId is extracted from the request

  try {
    // Check if the request already exists
    const existingRequest = await NotificationRequest.findOne({ user, eventId });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested a notification for this itinerary.' });
    }

    // Create a new notification request
    const newRequest = new NotificationRequest({ user, eventId });
    await newRequest.save();

    res.status(201).json({ message: 'Notification request created successfully.' });
  } catch (error) {
    console.error('Error creating notification request:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { requestNotification };