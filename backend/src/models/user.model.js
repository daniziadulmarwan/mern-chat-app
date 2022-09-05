const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

// UserSchema.methods.matchPassword = async (password) => {
//   return await bcrypt.compare(password, this.password);
// };

module.exports = mongoose.model("User", UserSchema);
