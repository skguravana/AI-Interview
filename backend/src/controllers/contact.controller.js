import Contact from '../models/Contact.model.js';

export const submitContact = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user._id;

    const contact = await Contact.create({
      userId,
      subject,
      message
    });

    res.status(201).json({
      message: "Your message has been submitted successfully",
      contact
    });
  } catch (error) {
    console.error("Error submitting contact:", error);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
};

export const getUserContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const contacts = await Contact.find({ userId }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching user contacts:", error);
    res.status(500).json({ message: "Failed to fetch contact history" });
  }
};