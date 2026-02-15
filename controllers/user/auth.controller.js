const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const { generateOtp } = require("../../services/otp.service");
const { sendEmail } = require("../../services/email.service");
const jwt = require("jsonwebtoken");
const fs = require("fs");


// CREATE ACCOUNT
exports.createAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      msg: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, "MYSECRETKEY", {
      expiresIn: "24h",
    });
    console.log(token)

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//SEND OTP
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = generateOtp();

    user.resetOtp = otp;
    user.otpExpire = Date.now() + 8 * 60 * 1000;
    const userdata=await user.save();
console.log("kuch bhi..",userdata)

    await sendEmail(email, "Reset Password OTP", `Your OTP is: ${otp}`);

    res.json({ success: true, msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// VERIFY & RESET
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password)
      return res.status(400).json({ msg: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.resetOtp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    if (user.otpExpire < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ success: true, msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// get profile of user
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};
// admin profile  get api
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.user.id,
      role: "admin"
    }).select("name email photo");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
console.log("update admine profile")
// update Adminprofile
exports.updateAdminProfile = async (req, res) => {
  try {
    const updateData = {};

    if (req.body?.name) {
      updateData.name = req.body.name;
    }

    if (req.file) {
      updateData.photo = req.file.path;
    }

    const admin = await User.findOneAndUpdate(
      { _id: req.user.id, role: "admin" },
      updateData,
      { new: true }
    ).select("name email photo");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      success: true,
      message: "Admin profile updated successfully",
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message
    });
  }
};





// user ki profile update...
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body; //only allowed name and email

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};

// user delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting profile",
      error: error.message,
    });
  }
};
//edit profileImage ki api...
// const fs = require("fs");

// //Upload / Update Profile Image
// exports.updateProfileImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload an image",
//       });
//     }

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     //delete old image if exists
//     if (user.profileImage && fs.existsSync(user.profileImage)) {
//       fs.unlinkSync(user.profileImage);
//     }

//     user.profileImage = req.file.path;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile image updated successfully",
//       profileImage: user.profileImage,
//     });
//   } catch (error) {
//     console.error("Profile Image Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// //Delete Profile Image
// exports.deleteProfileImage = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user || !user.profileImage) {
//       return res.status(404).json({
//         success: false,
//         message: "Profile image not found",
//       });
//     }

//     if (fs.existsSync(user.profileImage)) {
//       fs.unlinkSync(user.profileImage);
//     }

//     user.profileImage = null;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile image deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Image Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// // Get Profile Image
// exports.getProfileImage = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("profileImage");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       profileImage: user.profileImage,
//     });
//   } catch (error) {
//     console.error("Get Image Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };



