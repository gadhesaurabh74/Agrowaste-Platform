const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config/config"); // Assuming config.js has mongoURI and port

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Database Connection
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Error:", err));

// Routes
const auth = require("./routes/authRoutes");
const farmerAuth = require("./routes/farmerAuthRoutes");
const buyerAuth = require("./routes/buyerAuthRoutes");
const listings = require("./routes/listingRoutes");
const offers = require("./routes/offerRoutes");
const farmerProfile = require("./routes/farmerProfileRoutes");
const buyerProfile = require("./routes/buyerProfileRoutes");
const notifications = require("./routes/notificationRoutes");

app.use("/auth/me", auth);
app.use("/auth/farmer", farmerAuth);
app.use("/auth/buyer", buyerAuth);
app.use("/api/farmer/profile", farmerProfile);
app.use("/api/buyer/profile", buyerProfile);
app.use("/api/listings", listings);
app.use("/api/offers", offers);
app.use("/api/notifications", notifications);

// Server Start
app.listen(config.port, () => {
  console.log(`Server on port ${config.port}`);
});