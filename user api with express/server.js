const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
const notFound = require("./middleware/notFound.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler)

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
