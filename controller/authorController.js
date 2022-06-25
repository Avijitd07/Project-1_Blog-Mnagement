const authorModel = require("../models/authorModels");
const jwt = require("jsonwebtoken");



const creatAuthor = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length != 0) {
      let authorData = await authorModel.create(data);
      res.status(201).send({ status: true, msg: "Author Created Succefully", data: authorData });
    } else {
      res.status(400).send({ status: false, msg: "Bad request" });
    }

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }

};

const authorLogin = async function (req, res) {
  try {
    const { email, password } = req.body

    if (!email && password) return res.status(422).send({ status: false, msg: "All fields are required" });

    let authorData = await authorModel.findOne({ email: email });

    if (!authorData) return res.status(400).send({ status: false, msg: "Bad request" });

    let token = jwt.sign(
      {
        authorId: authorData._id.toString()
      },
      "IUBGIU22NKJWWEW89NO2ODWOIDH2"
    );
    res.setHeader("x-api-key", token);        //["x-api-key"]= token
    res.status(201).send({ status: true, token: token });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};






module.exports.creatAuthor = creatAuthor;
module.exports.authorLogin = authorLogin;
