const express = require("express");
const app = express();
const route = require("./router/route");
require("./dbConnection/mongoose");
const port = process.env.PORT || 5001;



app.use(express.json())
app.use("/", route);

app.listen(port, () => console.log(`Running Port ${port}`));


