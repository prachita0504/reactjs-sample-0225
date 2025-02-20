const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, 
    },
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 140,
    },
    password: {
      type: String,
      required: true,
    },
    todos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Todo",
      },
    ],
    Books: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Books",
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
