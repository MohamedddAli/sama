import express from "express";
import {
  sendMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/message.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", getMessages);
router.patch("/:id/status", updateMessageStatus);
router.delete("/:id", deleteMessage);

export default router;
