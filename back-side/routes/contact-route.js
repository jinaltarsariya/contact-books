const express = require("express");
const {
  postContact,
  updateContact,
  deleteContact,
  getContact,
  contactList,
} = require("../controller/contact-controller");
const { userToken } = require("../middleware/user-auth");
let router = express();

router.post("/create", userToken, postContact);
router.put("/update", userToken, updateContact);
router.delete("/delete", userToken, deleteContact);
router.get("/", userToken, getContact);
router.get("/list", contactList);

module.exports = router;
