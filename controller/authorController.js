const authorModel = require("../models/authorModels");
const jwt = require("jsonwebtoken");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;

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




const creatAuthor = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidBody(data)) {
      return res.status(400).send({ status: false, msg: "Invalid Request Parameter, Please Provide Another Details", });
    }

    let { title, fname, lname, email, password } = data;

    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "Title is Required" })
    }
    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, msg: "Title is not valid" })
    }
    if (!isValid(fname)) {
      return res.status(400).send({ status: false, msg: "First Name is Required" })
    }
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "Last Name is Required" })
    }


    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "Email is Required" })
    }
    if (!(emailRegex.test(email))) {
      return res.status(400).send({ status: false, msg: "Email Should Be Valid Email Address" })
    }


    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Password is Required" })
    }
    if (!passwordRegex.test(password)){
      return res.status(400).send({ status: false, msg: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & ] and length should be min of 6-15 charachaters" })
    }




    //Checking email is unique or not
    const isEmailIdUnique = await authorModel.findOne({ email })
    if (isEmailIdUnique) {
      return res.status(400).send({ status: false, msg: "Email is Already Present" })
    }

    //Using all valid inputs
    const newAuthorData = { fname, lname, title, email, password }

    let authorData = await authorModel.create(newAuthorData);
    res.status(201).send({ status: true, msg: "Author Created Succefully", data: authorData });


  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }

};

const authorLogin = async function (req, res) {
  try {
    const credentials = req.body;
    const { email, password } = credentials;

    if (!email || !password) return res.status(422).send({ status: false, msg: "All fields are required" });

    if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is required." })

    if (!isValid(password)) return res.status(400).send({ status: false, msg: "Password is required." })


    if (!(emailRegex.test(email))) {
      return res.status(400).send({ status: false, msg: "Email Should Be Valid Email Address" })
    }
    if (!passwordRegex.test(password)){
      return res.status(400).send({ status: false, msg: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & ] and length should be min of 6-15 charachaters" })
    }
    


    let authorData = await authorModel.findOne({ email: email, password: password });

    if (!authorData) return res.status(400).send({ status: false, msg: "Bad request" });

    let token = jwt.sign(
      {
        authorId: authorData._id.toString()
      },
      "IUBGIU22NKJWWEW89NO2ODWOIDH2"
    );
    //res.setHeader("x-api-key", token);        //["x-api-key"]= token
    res.status(201).send({ status: true, token: token });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};






module.exports.creatAuthor = creatAuthor;
module.exports.authorLogin = authorLogin;
