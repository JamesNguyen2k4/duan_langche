const router = require("express").Router();
const { getVillages, getTeaTypes, getActivities } = require("../controllers/api.controller");

router.get("/villages", getVillages);
router.get("/tea-types", getTeaTypes);
router.get("/activities", getActivities);

module.exports = router;