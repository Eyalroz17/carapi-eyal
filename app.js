const express = require("express");
const http = require("http");
const path = require("path");
const cors  = require("cors");

const {routesInit} = require("./routes/configRoutes");
require("./db/mongoConnect");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

routesInit(app);


const server = http.createServer(app);
let port = process.env.PORT || 3001;
server.listen(port);
