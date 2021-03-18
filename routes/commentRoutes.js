const express = require('express');
const router = express.Router();
const Joi = require("joi");

const { commentSchema } = require("../schemas.js");

router.get("/", async (req, res) => { //Home page.
    const uploads = await Upload.find({});
    res.render("uploads/index.ejs", { uploads });
  });