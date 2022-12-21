// Services
const userService = require("../services/user-service");
const hashService = require("../services/hash-service");
const tokenService = require("../services/token-service");

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

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).send({
        message: "All fields are required",
      });
    }

    // Checking user registered in db or not
    const registeredUser = await userService.findUser({ email });
    if (!registeredUser) {
      return res.status(404).json({
        message: "Sorry, you are not registered in our record.",
      });
    }

    // Going to hash the entered password and will check that with saved password in db
    const hashedPassword = hashService.hashPassword(password);
    if (hashedPassword === registeredUser.password) {
      try {
        const { accessToken, refreshToken } = tokenService.generateTokens({
          _id: registeredUser._id,
          activated: registeredUser.activated,
        });

        await tokenService.storeRefreshToken(refreshToken, registeredUser._id);

        res.cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        });

        res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        });

        return res.status(200).json({
          message: "Yes, you can access the dashboard",
          user: registeredUser,
          accessToken,
          refreshToken,
        });
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return res.status(403).json({
        message: "Please enter valid password",
      });
    }
  }
}

module.exports = new AuthController();
