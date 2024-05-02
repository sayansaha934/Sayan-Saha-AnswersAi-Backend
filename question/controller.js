const { ChatOpenAI } = require("@langchain/openai");
const Question = require("./model");

const getAnswer = async (req, res) => {
    try {
        const { query } = req.body;

        const result = await getAIGeneratedAnswer(query);

        // Create a new user
        const question = new Question({
            user_id: req.user.id,
            query: query,
            result: result,
        });

        // Save the question to the database
        await question.save();

        res.json({ query: query, result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getQueryById = async (req, res) => {
    try {
        const question = await Question.findOne({ _id: req.params.id });

        if (!question) {
            return res.status(404).json({ message: "Query not found" });
        }

        res.json({
            query: question.query,
            result: question.result,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getQueriesByUserId = async (req, res) => {
    try {
        const questions = await Question.find({ user_id: req.params.id }).select("query");
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAIGeneratedAnswer = async (query) => {
    const chatModel = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await chatModel.invoke(query);
    return response.content;


}
module.exports = {
    getAnswer,
    getQueryById,
    getQueriesByUserId,
    getAIGeneratedAnswer
}