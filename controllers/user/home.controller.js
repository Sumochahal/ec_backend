const Category = require("../../models/category.model");
const Banner = require("../../models/banner.model");

exports.getHomeData = async (req, res) => {
  try {
    const now = new Date();

    /*ACTIVE CATEGORIES */
    const categories = await Category.find({ is_active: true })
      .select("cat_name cat_images remark")
      .sort({ createdAt: -1 });

    /* HOME BANNERS (TIMER LOGIC)*/
    const banners = await Banner.find({
      banner_type: "home",
      is_active: true,
      $or: [
        //1️Timer OFF → always show
        { has_timer: false },

        //2Timer ON but dates not set → show
        {
          has_timer: true,
          timer_start: null,
          timer_end: null,
        },

        //3️Timer ON + active time range → show
        {
          has_timer: true,
          timer_start: { $lte: now },
          timer_end: { $gte: now },
        },
      ],
    })
      .select(
        "title image redirect_url has_timer timer_start timer_end position"
      )
      .sort({ position: 1 });

    /* RESPONSE */
    res.status(200).json({
      success: true,
      data: {
        categories,
        banners,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
