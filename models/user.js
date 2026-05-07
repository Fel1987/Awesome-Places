const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

UserSchema.plugin(passportLocalMongoose.default);

const User = model("User", UserSchema);

module.exports = User;
