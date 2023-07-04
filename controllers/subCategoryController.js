const SubCategory = require("../models/subCategoryModel");

const create_subcategory = async (req, res) => {
  try {
    const check_sub = await SubCategory.find({
      category_id: req.body.category_id,
    });
    if (check_sub.length > 0) {
      let checked = false;
      for (let i = 0; i < check_sub.length; i++) {
        if (
          check_sub[i]["sub_category"].toLowerCase() ===
          req.body.sub_category.toLowerCase()
        ) {
          checked = true;
          break;
        }
      }
      if (checked == false) {
        const subCategory = new SubCategory({
          category_id: req.body.category_id,
          sub_category: req.body.sub_category,
        });
        const sub_cat_data = await subCategory.save();
        res.status(200).send({
          success: true,
          msg: "Sub-category-details",
          data: sub_cat_data,
        });
      } else {
        res.status(400).send({
          success: true,
          msg: `This category ${req.body.sub_category} is already exists`,
        });
      }
    } else {
      const subCategory = new SubCategory({
        category_id: req.body.category_id,
        sub_category: req.body.sub_category,
      });
      const sub_cat_data = await subCategory.save();
      res.status(200).send({
        success: true,
        msg: "Sub-category-details",
        data: sub_cat_data,
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  create_subcategory,
};
