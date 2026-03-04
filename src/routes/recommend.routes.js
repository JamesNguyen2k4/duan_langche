const router = require("express").Router();
const recommendController = require("../controllers/recommend.controller");

router.post("/recommend", recommendController.recommend);

module.exports = router;