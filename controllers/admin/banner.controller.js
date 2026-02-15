const Banner = require("../../models/banner.model");

exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });

    }

    const {
      title,
      banner_type,
      redirect_url,
      position,
      has_timer,
      timer_start,
      timer_end,
    } = req.body;
console.log("BODY:", req.body);

    const isTimerEnabled = has_timer === "true" || has_timer === true;

    //CONDITION
    if (isTimerEnabled) {
      if (!timer_start || !timer_end) {
        return res.status(400).json({
          success: false,
          message: "timer_start and timer_end are required when has_timer is true",
        });
      }

      if (new Date(timer_start) >= new Date(timer_end)) {
        return res.status(400).json({
          success: false,
          message: "timer_end must be greater than timer_start",
        });
      }
    }

    const banner = await Banner.create({
      title,
      banner_type,
      redirect_url,
      position: position || 0,
      image: req.file.path,

      has_timer: isTimerEnabled,
      timer_start: isTimerEnabled ? timer_start : null,
      timer_end: isTimerEnabled ? timer_end : null,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= READ (ALL) ================= */
exports.getAllBanners = async (req, res) => {
  try {
    const { banner_type } = req.query;
    const filter = banner_type ? { banner_type } : {};

    const banners = await Banner.find(filter).sort({ position: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= READ (SINGLE) ================= */
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//UPDATE*/
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const {
      title,
      banner_type,
      redirect_url,
      position,
      has_timer,
      timer_start,
      timer_end,
    } = req.body;

    const isTimerEnabled = has_timer === "true" || has_timer === true;

    if (isTimerEnabled) {
      if (!timer_start || !timer_end) {
        return res.status(400).json({
          success: false,
          message: "timer_start and timer_end are required when has_timer is true",
        });
      }

      banner.timer_start = timer_start;
      banner.timer_end = timer_end;
    } else {
      //CLEAN TIMER
      banner.timer_start = null;
      banner.timer_end = null;
    }

    if (req.file) banner.image = req.file.path;
    if (title) banner.title = title;
    if (banner_type) banner.banner_type = banner_type;
    if (redirect_url) banner.redirect_url = redirect_url;
    if (position !== undefined) banner.position = position;
    if (has_timer !== undefined) banner.has_timer = isTimerEnabled;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* DELETE ================= */
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
