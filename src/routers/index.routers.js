const router = require("express").Router();
const { renderHome } = require("../controllers/page.controller");

router.get("/", renderHome);

module.exports = router;