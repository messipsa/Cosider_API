const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const res = require("express/lib/response");

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
    _id: user._id,
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

module.exports.register = async (req, res) => {
  try {
    const user = await this.findUserByEmail(req.body.email);
    if (user) {
      return res.status(400).json({ message: "Utilisateur existant" });
    }
    const passwordHashed = await this.hashPassword(req.body.password);

    await User.create({
      userName: req.body.userName,
      password: passwordHashed,
      email: req.body.email,
    });
    return res.status(200).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Vous devez insérer l'email et le mot de passe" });
    }
    const user = await this.findUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non existant" });
    }

    const match = await this.verifyPassword(req.body.password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Mot de passe invalide" });
    } else {
      const token = this.createToken(user);
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      return res
        .status(200)
        .cookie("token", token, options)
        .json({
          token,
          user: lodash.omit(user, ["_id", "password"]),
        });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("token", "none ", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return res
    .status(200)
    .json({ succes: true, message: "Utilisateur déconnecté" });
};
