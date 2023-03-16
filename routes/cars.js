const express = require("express");
const { auth } = require("../middlewares/auth");
const { CarsModel, validateJoi } = require("../models/carsModel");
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 5;
    let page = req.query.page - 1 || 0;
    let sort = req.query.sort || "price";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    try {
        let data = await CarsModel
            .find({})
            .limit(perPage)
            .skip(page * perPage)
            .sort({ [sort]: reverse });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

router.get("/price", async (req, res) => {
    let minPrice = req.query.min ? Number(req.query.min) : 0;
    let maxPrice = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;
    try { 
        let data = await CarsModel.find({ price: { $gte: minPrice, $lte: maxPrice } });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

router.get("/singlecar/:id", async (req, res) => {
    try {
        let data = await CarsModel.findById(req.params.id);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

router.get("/search", async (req, res) => {
    try {
        let search = req.query.s;
        let searchExp = new RegExp(search, "i");
        let data = await CarsModel.find({
            $or: [{ company: searchExp }, { name: searchExp }]
        }).limit(20);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

router.get("/category/:catName", async (req, res) => {
    try {
        const catName = req.params.catName;
        const catExp = new RegExp(catName, "i");
        const data = await CarsModel.find({
            $or: [{ category: catExp }, { category: catName }]
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "there is no category of this" });
    }
});

router.post("/", auth, async (req, res) => {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let cars = new CarsModel(req.body);
        cars.user_id = req.tokenData._id;
        await cars.save();
        res.json(cars)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:idEdit", auth, async (req, res) => {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit;
        let data;
        if (req.tokenData.role == "admin") {
            data = await CarsModel.updateOne({ _id: idEdit }, req.body);
        }
        else {
            data = await CarsModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body);

        }
        res.json({msg:"you didnt create this element"});
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data;
        if (req.tokenData.role == "admin") {
            data = await CarsModel.deleteOne({ _id: idDel });
        }
        else {
            data = await CarsModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });


        }
        res.json({msg:"you didnt create this element"});    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;