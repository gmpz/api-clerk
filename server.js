const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Render 🚀");
});

// ใช้ PORT จาก env หรือ 3000 เวลารัน local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});