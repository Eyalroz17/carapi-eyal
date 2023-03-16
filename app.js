const express = require("express");
const http = require("http");
const path = require("path");
const cors  = require("cors");

const {routesInit} = require("./routes/configRoutes");
// התחברות למסד 
require("./db/mongoConnect");

const app = express();
// מבטל אבטחה , ומאפשר לבצע בקשת איי פי איי מדומיין משרת אחר
app.use(cors());
// כדי שנוכל לשלוח באדי מצד לקוח
app.use(express.json());
// להגדיר תיקייה סטטית שתיהיה התיקייה בשם פאבליק
app.use(express.static(path.join(__dirname,"public")));

routesInit(app);


const server = http.createServer(app);
// נותן את האופציה שאני מעלה לשרת אמיתי שהשרת יספק
// את הפורט בעצמו במקום שאני אצטרך לשנות ידני
let port = process.env.PORT || 3001;
server.listen(port);
// npm install -> כדי להתקין פרוייקט מוכן, שיותקנו בו כל המודולים
