const router = require("express").Router();
const { getVillages, getTeaTypes } = require("../controllers/api.controller");

router.get("/villages", getVillages);
router.get("/tea-types", getTeaTypes);

module.exports = router;