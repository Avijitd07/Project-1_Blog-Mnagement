const express=require('express')
const router=express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')
const middleWare= require("../middleWare/auth.js")


router.post("/authors",authorController.creatAuthor);

router.post("/blogs", middleWare.authentication, blogController.creatBlog);

router.get("/blogs" ,middleWare.authentication, blogController.getBlogs);

router.put("/blogs/:blogId", middleWare.authentication,middleWare.authorization,  blogController.updateBlogs);

router.delete("/blogs/:blogId",middleWare.authentication,middleWare.authorization, blogController.deleteBlog);

router.delete("/blogs" ,middleWare.authentication,middleWare.authorization_2, blogController.deleteQuery);

router.post("/login", authorController.authorLogin);

module.exports=router
