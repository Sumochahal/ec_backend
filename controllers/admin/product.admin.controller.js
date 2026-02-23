const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subcategory.model");

exports.createProduct = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { subcategory_id, name, price, description } = req.body;

    //Validate Category
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2Validate SubCategory
    const subCategory = await SubCategory.findById(subcategory_id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    // 3Ensure subcategory belongs to category
    if (subCategory.category_id.toString() !== category_id) {
      return res.status(400).json({
        success: false,
        message: "SubCategory does not belong to this Category",
      });
    }

    // 4️Collect images
    const images = req.files ? req.files.map(file => file.path) : [];
    // console.log("FILES:", req.files);

    // 5️Create Product
    const product = await Product.create({
      category_id,
      subcategory_id,
      name,
      price,
      description,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// get single product by id 
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id);

    // Check if product found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// for all products gets
exports.getallProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// start****get all products by categoryid with name and same as well for subcategory id with name
// exports.getProductwithname = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("category_id", "name")       // 🔥 add this
//       .populate("subcategory_id", "name")   // 🔥 add this
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       total: products.length,
//       data: products,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// end *** get all products by categoryid with name and same as well for subcategory id with

// delete products by id 
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// update products
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      subcategory_id,
      name,
      price,
      description,
      is_active
    } = req.body;

    // 1️Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2️If category provided → validate
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      product.category_id = category_id;
    }

    // 3️If subcategory provided → validate
    if (subcategory_id) {
      const subCategory = await SubCategory.findById(subcategory_id);
      if (!subCategory) {
        return res.status(404).json({
          success: false,
          message: "SubCategory not found",
        });
      }

      // Ensure subcategory belongs to category
      const finalCategoryId = category_id || product.category_id;

      if (subCategory.category_id.toString() !== finalCategoryId.toString()) {
        return res.status(400).json({
          success: false,
          message: "SubCategory does not belong to this Category",
        });
      }

      product.subcategory_id = subcategory_id;
    }

    // 4Update other fields if provided
    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (description) product.description = description;
    if (is_active !== undefined) product.is_active = is_active;

    // 5️If new images uploaded
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.path);
    }

    // 6Save updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

