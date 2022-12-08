// Services
const userService = require("../services/user-service");
const hashService = require("../services/hash-service");

class AuthController {
  async signup(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        message: "All fields are required!",
      });
    }

    // Checking weather user already exists in db
    const isAlreadyExists = await userService.findUser({ email });
    if (isAlreadyExists === true) {
      return res.status(403).json({
        message: "This email address is already taken!",
      });
    }

    // Hashinng the password
    const hashedPassword = hashService.hashPassword(password);

    // Creating a new user in db
    const createdUser = await userService.createUser({
      email,
      password: hashedPassword,
    });

    if (createdUser) {
      return res.status(200).json({
        message: "User registered successfully!",
      });
    } else {
      return res.status(500).json({
        message: "Error occurs, please try again later!",
      });
    }
  }
}

module.exports = new AuthController();
