const router = require("express").Router();

// Hello from express.js
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from express.js",
  });
});

module.exports = router;
