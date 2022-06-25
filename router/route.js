const express=require('express')
const router=express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')
const middleWear= require("../middleWear/auth.js")


router.post("/authors",authorController.creatAuthor);

router.post("/blogs", middleWear.authentication, blogController.creatBlog);

router.get("/blogs" ,middleWear.authentication, blogController.getBlogs);

router.put("/blogs/:blogId", middleWear.authentication,middleWear.authorization,  blogController.updateBlogs);

router.delete("/blogs/:blogId",middleWear.authentication,middleWear.authorization, blogController.deleteBlog);

router.delete("/blogs" ,middleWear.authentication,middleWear.authorization_2, blogController.deleteQuery);

router.post("/login", authorController.authorLogin);

module.exports=router
