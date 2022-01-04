const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(400).json({
        message: "Vous n'avez pas l'authorisation à faire cette opération",
      });
    }
    if (!authorization.startsWith("Bearer ")) {
      return res.status(400).json({ message: "authorisation invalide" });
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
