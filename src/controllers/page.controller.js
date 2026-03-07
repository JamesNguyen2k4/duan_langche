exports.renderHome = (req, res) => {
    res.render("index", {
      siteTitle: "Làng Chè Thái Nguyên",
      heroSubtitle: "Khám phá văn hóa trà Việt"
    });
  };