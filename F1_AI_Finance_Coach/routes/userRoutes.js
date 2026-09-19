const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/users/register
// Prototype login/registration: name + email only.
router.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      user = await User.create({
        name: cleanName,
        email: cleanEmail
      });
    } else if (user.name !== cleanName) {
      user.name = cleanName;
      await user.save();
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
