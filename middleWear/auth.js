const jwt = require("jsonwebtoken");
const blogModels = require("../models/blogModels");

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

        let blogId = req.params.blogId
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

        let authorId = req.query.authorId;

        if (authorId && (authorId != authorLoggedIn)) return res.status(403).send({ status: false, msg: "Unauthorized" })

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