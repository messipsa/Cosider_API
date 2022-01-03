const { model, Schema } = require("mongoose");

const { isEmail } = require("validator");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
