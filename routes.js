const authController = require("./controllers/auth-controller");

const router = require("express").Router();

// Hello from express.js
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from express.js",
  });
});

router.post("/api/auth/signup", authController.signup);
router.post("/api/auth/login", authController.login);

module.exports = router;
