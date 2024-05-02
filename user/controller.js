
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./model");


const SECRET_KEY = "0SjSLEqrPSUTdgyJzPDHspeQdRCA9X";

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const encodedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: encodedPassword,
    });

    // Save the user to the database
    await user.save();

    res.json({ message: "User signed up successfully!", user_id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found or password doesn't match, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const logout = async (req, res) => {
  try {
    // For a basic logout, you can simply invalidate the token on the client side.
    // There's no need for server-side actions for token invalidation.

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    // Extract the email and user id from the decoded token
    const { email, id } = req.user;

    // Generate a new token with the same payload (email and id) but with a new expiration time
    const newToken = jwt.sign({ email, id }, SECRET_KEY, { expiresIn: "24h" });

    res.json({ message: "Token refreshed successfully", token: newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}
module.exports = {
  signUp,
  logIn,
  logout,
  refreshToken,
  verifyToken,
  getUserProfile,

};