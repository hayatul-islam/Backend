const express = require("express");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/error.middleware");
const notFound = require("./middlewares/notFound.middleware");

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blog api is running",
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
