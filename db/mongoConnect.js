const mongoose = require('mongoose');
const {config} = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(`mongodb+srv://${config.mongoUser}:${config.mongoPass}@cluster0.okava7m.mongodb.net/apiprojectt`);
  console.log("mongo connect apiproject ");
  
}