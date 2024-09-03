const express = require("express");

const { userToken } = require("../middleware/user-auth");
const {
  postCreateGroup,
  updateGroup,
  deleteGroup,
  groupList,
} = require("../controller/Group.Controller");
let router = express();

router.post("/create", userToken, postCreateGroup);
router.put("/update", userToken, updateGroup);
router.delete("/delete", userToken, deleteGroup);
router.get("/list", userToken, groupList);

module.exports = router;
