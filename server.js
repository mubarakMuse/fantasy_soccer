require('dotenv').config()

const express = require("express");
const app = express();
module.exports = app

const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorHandler")

app.use(bodyParser.json());

app.use("/users", require("./resources/userResource"));
app.use("/players", require("./resources/playerResource"));
app.use("/teams", require("./resources/teamResource"));
app.use("/transfers", require("./resources/transferResource"));

app.use(errorHandler)

// start server
const port = 4000;
app.listen(port, () => console.log("Server listening on port " + port));
