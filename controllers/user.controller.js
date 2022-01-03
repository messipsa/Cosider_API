const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");

module.exports.createToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
    expiresIn: 24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return null;
  }
  return {
    userName: user.userName,
    password: user.password,
    email: user.email,
  };
};

module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

module.exports.verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

module.exports.register = (req, res) => {
  try {
    const user = await this.findUserByEmail(req.body.email);
    if (user) {
      return res.status(400).json({ message: "Utilisateur existant" });
    }
    const passwordHashed = await this.hashPassword(password);
    await User.create({
      userName: req.body.username,
      password: passwordHashed,
      email: req.body.email,
    });
    return res.status(200).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports.login = (req, res) => {
  try {
    const user = await this.findUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non existant" });
    }
    const match = this.verifyPassword(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Mot de passe invalide" });
    }
    const token = this.createToken(user);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ token, user: lodash.omit(user, ["password"]) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports.logOut = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
