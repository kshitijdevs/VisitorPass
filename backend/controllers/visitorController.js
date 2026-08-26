const Visitor = require("../models/Visitor");

const createVisitor = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const visitor = await Visitor.create({
            name: req.body?.name,
            email: req.body?.email,
            phone: req.body?.phone,
            company: req.body?.company,
            purpose: req.body?.purpose,
            photo: req.file
                ? `/uploads/${req.file.filename}`
                : ""
        });

        res.status(201).json(visitor);

    } catch (error) {
        console.error("CREATE VISITOR ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ _id: -1 });

        res.json(visitors);

    } catch (error) {
        console.error("GET VISITORS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createVisitor,
    getVisitors
};