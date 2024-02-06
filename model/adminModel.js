const mongoose = require("mongoose");
const Schemae = mongoose.Schema;

const adminSchema = Schemae(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    isDeleted: { type: Boolean, enum: [true, false], default: false },
  },
  {
    timestamps: true,
    versionkey: false,
  }
);
module.exports = mongoose.model("vras-admin",adminSchema);