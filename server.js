const express = require("express");
const bodyParser = require("body-parser");
const { Webhook } = require("svix"); // Clerk ใช้ svix ในการตรวจสอบ signature

const app = express();

// Clerk ต้องใช้ raw body ในการ verify
app.use("/api/webhooks/clerk", bodyParser.raw({ type: "application/json" }));

app.post("/api/webhooks/clerk", (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error("❌ Error verifying webhook:", err.message);
    return res.status(400).json({ success: false });
  }

  const { id, type } = evt;
  console.log(`✅ Webhook received: ${id} - ${type}`);

  // ตัวอย่างจัดการ event
  switch (type) {
    case "user.created":
      console.log("👤 New user created:", evt.data.id);
      break;
    case "user.updated":
      console.log("🔄 User updated:", evt.data.id);
      break;
    case "session.created":
      console.log("📲 User logged in:", evt.data.id);
      break;
    default:
      console.log(`⚡ Unhandled event: ${type}`);
  }

  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Hello Render 🚀");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});