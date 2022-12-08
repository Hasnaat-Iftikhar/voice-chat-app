require("dotenv").config();
const express = require("express");
const DbConnect = require("./database");

// Routes
const router = require("./routes");

// App
const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());

app.use(router);

DbConnect();

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
