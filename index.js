require("dotenv").config();
const express = require("express");
var cors = require("cors");
const connectToMongoDB = require("./db");
const path = require('path');

const PORT = process.env.PORT;
connectToMongoDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", require("./user/router"));
app.use("/api", require("./question/router"));

app.listen(PORT, () => {
    console.log(`Q&A app listening on port ${PORT}`);
});