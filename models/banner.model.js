const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    banner_type: {
      type: String,
      enum: ["home", "about", "category", "offer"],
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    redirect_url: {
      type: String,
      required: true,
    },

    //TIMER FIELDS
    has_timer: {
      type: Boolean,
      default: true, // timer show karna hai ya nahi
    },

    timer_start: {
      type: Date,
    },

    timer_end: {
      type: Date, // frontend isi se countdown banayega
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    position: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
