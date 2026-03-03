exports.renderHome = (req, res) => {
    res.render("index", {
      siteTitle: "Làng Chè Việt Nam",
      heroSubtitle: "Khám phá văn hóa trà Việt"
    });
  };