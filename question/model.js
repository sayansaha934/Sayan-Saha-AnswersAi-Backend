const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        query: { type: String, required: true },
        result: { type: String, required: false },
    }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;