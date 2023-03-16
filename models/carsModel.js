const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    company: String,
    name: String,
    category: String,
    price: Number,
    img_url: String,
    date_created: {
        type: Date, default: Date.now
    },
    user_id: String
})
exports.CarsModel = mongoose.model("cars", schema);

exports.validateJoi = (_reqBody) => {
    let joiSchema = Joi.object({
        company: Joi.string().min(2).max(100).required(),
        name: Joi.string().min(2).max(800).required(),
        category: Joi.string().min(1).max(400).required(),
        price: Joi.number().min(1).max(999999).required(),
        img_url: Joi.string().min(2).max(500).allow(null, ""),
    })
    return joiSchema.validate(_reqBody)
}
