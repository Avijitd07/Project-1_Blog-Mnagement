const blogModels = require("../models/blogModels");
const authorModel = require("../models/authorModels");
const ObjectId = require("mongoose").Types.ObjectId



const isValid = function (x) {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x === "string" && x.trim().length === 0) return false;
  return true;
};
const isValidTitle = function (x) {
  return ["Mr", "Mrs", "Miss"].indexOf(x) !== -1;
};
const isValidBody = function (x) {
  return Object.keys(x).length > 0;
};


const creatBlog = async function (req, res) {
  try {
    let data = req.body;
    
    if (!isValidBody(data)) {
      return res.status(400).send({ status: false, msg: "Invalid Request Parameter, Please Provide Another Details", });
    }


    const { title, body, authorId, category, subcategory, tags, isPublished } = data




    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "Title is Required" })
    }

    if (!isValid(body)) {
      return res.status(400).send({ status: false, msg: "Body is Required" })
    }

    if (!isValid(authorId)) {
      return res.status(400).send({ status: false, msg: "AuthorId is Required" })
    }

    if (!isValid(category)) {
      return res.status(400).send({ status: false, msg: "Category is Required" })
    }

    if(isPublished){
      if(typeof isPublished != 'boolean') return res.status(400).send({ status: false, msg: "isPublished must be boolean value" })
    }

    //Validation for ID format
    if (!ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "Not a valid author ID" })

    //Validation for Id is correct or not
    let findAuthorId = await authorModel.findById(authorId)
    if (!findAuthorId) return res.status(404).send({ status: false, msg: "Author Not found. Please enter a valid Author id." })

    //Using all the valid inputs
    const validBlogData = { title, body, authorId, category, isPublished  }

    if (tags) {
      if (Array.isArray(tags)) {
        validBlogData['tags'] = [...tags]
      }
     
    }
    if (subcategory) {
      if (Array.isArray(subcategory)) {
        validBlogData['subcategory'] = [...subcategory]
      }
     
    }


    if (data.isPublished == true) {
      let blogData = await blogModels.create(validBlogData);
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


    if (authorId) {
      if (!ObjectId.isValid(authorId)) {
        return res.status(400).send({ status: false, msg: "not valid id" })
      }
      if (ObjectId.isValid(authorId)) {
        filterData.authorId = authorId;
      }
    }
    if (category) filterData.category = category;
    if (subcategory) filterData.subcategory = { $all: subcategory.split(",") }
    if (tags) filterData.tags = { $all: tags.split(",") }

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

    //validation of blogId
    if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Not a valid blog ID" })



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

    //validation of blogId
    if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Not a valid blog ID" })

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

    if (authorId) {
      if (!ObjectId.isValid(authorId)) {
        return res.send({ status: false, msg: "not valid id" })
      }
      if (ObjectId.isValid(authorId)) {
        filterData.authorId = authorId;
      }
    }

    if (category) filterData.category = category
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