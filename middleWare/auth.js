const jwt = require("jsonwebtoken");
const blogModels = require("../models/blogModels");
const ObjectId = require("mongoose").Types.ObjectId

const isValid = function (x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};


const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

        // console.log(token);

        let decodedToken = jwt.verify(token, "IUBGIU22NKJWWEW89NO2ODWOIDH2");

        //console.log(decodedToken)

        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token is invalid" });

        req["decodedToken"] = decodedToken;


        next();
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
};

const authorization = async function (req, res, next) {

    try {
        let decodedToken = req["decodedToken"];

        let authorLoggedIn = decodedToken.authorId
        //console.log(authorLoggedIn)

        //Validation of author Id from token
        if (!ObjectId.isValid(authorLoggedIn)) return res.status(400).send({ status: false, msg: "Not a valid author ID from Token" })

        let blogId = req.params.blogId

        //Validation of blogId 
        if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Not a valid blog ID" })

        let blogData = await blogModels.findById(blogId)

        //console.log(blogData.authorId)
        let authorWantToModify = blogData.authorId

        if (authorWantToModify != authorLoggedIn) return res.status(403).send({ status: false, msg: "Not Authorised" })

        next();


    } catch (error) {
        res.status(500).send({ Error: error.message, msg: "Server error " });
    }
}

const authorization_2 = function (req, res, next) {

    try {
        let decodedToken = req["decodedToken"];

        let authorLoggedIn = decodedToken.authorId

        //Validation of author Id from token
        if (!ObjectId.isValid(authorLoggedIn)) return res.status(400).send({ status: false, msg: "Not a valid author ID from Token" })

        let authorId = req.query.authorId;

        //validation of author Id
        if (authorId) {
            if (!ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "Not a valid author ID from Token" })
            if (authorId != authorLoggedIn) return res.status(403).send({ status: false, msg: "Unauthorized" })

        }

        if (!authorId) {
            authorId = authorLoggedIn;
            req.query.authorId = authorId;
        }


        next();
    } catch (error) {
        res.status(500).send({ Error: error.message, msg: "Server error " });
    }

}

module.exports.authentication = authentication
module.exports.authorization = authorization
module.exports.authorization_2 = authorization_2