const blogModels = require("../models/blogModels");
const mongoose = require('mongoose');
const authorModel = require('../models/authorModels');
const authorController = require('../controller/authorController')
const jwt = require("jsonwebtoken");
const { listenerCount } = require("../models/authorModels");



const creatBlog = async function (req, res) {
  try {
    let data = req.body;

    if (data.isPublished == true) {
      let blogData = await blogModels.create(data);
      blogData.publishedAt = new Date();
      res.status(201).send({ status: true, msg: blogData });
    } else {
      let blogData = await blogModels.create(data);
      res.status(201).send({ status: true, msg: blogData });
    }

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });

  }
};

const getBlogs = async function (req, res) {

  try {
    let query = req.query;

    let { authorId, category, subcategory, tags } = query;

    let filterData = { isDeleted: false, isPublished: true }


    if (authorId) filterData.authorId = authorId;
    if (category) filterData.category = category;
    if (subcategory) filterData.subcategory = subcategory;
    if (tags) filterData.tags = tags;

    let blogData = await blogModels.find(filterData)

    if (!blogData) return res.status(404).send({ status: false, msg: "Data not found" })

    res.status(200).send({ status: true, data: blogData })

    //console.log(filterData)

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }


}

const updateBlogs = async function (req, res) {

  try {
    let blogId = req.params.blogId;
    let reqBody = req.body
    let { title, body, tags, subcategory } = reqBody;


    let updatedBlog = await blogModels.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      {
        $push: { tags: tags, subcategory: subcategory },
        $set: {
          title,
          body,
          isPublished: true,
          publishedAt: new Date(),
        },
      },
      { new: true }
    )

    if (!updatedBlog) return res.status(404).send({ status: false, msg: "Data not found" })

    res.status(200).send({ status: true, data: updatedBlog });

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const deleteBlog = async function (req, res) {

  try {
    let blogId = req.params.blogId

    let con = { $and: [{ _id: blogId }, { isDeleted: false }] };

    let updatedBlog = await blogModels.findOneAndUpdate(con, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

    if (!updatedBlog) return res.status(404).send({ status: false, msg: "Blog is not available" })

    //res.status(200).send({ status: true, data: " " });
    res.status(200).send({ status: true, data: updatedBlog })

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }


}

const deleteQuery = async function (req, res) {

  try {

    let query = req.query;
    let { authorId, category, tags, subcategory, isPublished } = query

    let filterData = { isDeleted: false };

    if (authorId) filterData.authorId = authorId
    if (category) filterData.category = { $all: category.split(",") }
    if (tags) filterData.tags = { $all: tags.split(",") }
    if (subcategory) filterData.subcategory = { $all: subcategory.split(",") }
    if (isPublished) filterData.isPublished = isPublished;

    const deleteBlogs = await blogModels.updateMany(filterData, { $set: { isDeleted: true } }, { new: true })

    if (!deleteBlogs) {

      res.status(404).send({ status: false, msg: "Data not found" })
    } else {
      res.send({ data: deleteBlogs });
    }

  } catch (err) {
    res.status(500).send({ msg: "invalid" });
  }

}


module.exports.creatBlog = creatBlog;
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlog = deleteBlog
module.exports.getBlogs = getBlogs;
module.exports.deleteQuery = deleteQuery