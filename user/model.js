const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        phone: { type: String, required: false },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    }
);

const User = mongoose.model("User", userSchema);


const invalidatedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

const InvalidatedToken = mongoose.model('InvalidatedToken', invalidatedTokenSchema);

module.exports = { User, InvalidatedToken };