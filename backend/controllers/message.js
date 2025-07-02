// controllers/messageController.js
import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  try {
    const { fullName, emailAddress, phoneNumber, subject, message } = req.body;

    // Validate required fields (optional: enhance this)
    if (!fullName || !emailAddress || !phoneNumber || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMessage = new Message({
      fullName,
      emailAddress,
      phoneNumber,
      subject,
      message,
    });

    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};
    const messages = await Message.find(filter).sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unresolved", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Status updated", data: updatedMessage });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message status",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete message", error: error.message });
  }
};
