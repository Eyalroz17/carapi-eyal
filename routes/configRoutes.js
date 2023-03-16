const indexR = require("./index");
const usersR = require("./users");
const carsR = require("./cars");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/cars",carsR);


}