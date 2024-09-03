const validator = require("validator");
const {
  error_res,
  checkRequiredFields,
  success_res,
} = require("../library/general");
const {
  getGroupByName,
  createGroup,
  doUpdateGroup,
  doDeleteGroup,
  getGroupByUserId,
} = require("../model/Group.Model");

const postCreateGroup = async (req, res) => {
  try {
    let { name } = req.body;
    userId = req?.user?._id;

    const missingField = checkRequiredFields(req.body, ["name"]);
    if (missingField) return res.json(error_res(missingField));

    if (!validator.isAlpha(name)) {
      return res.json(
        error_res(
          "Please enter valid group name and do not pass numbers and symbols !"
        )
      );
    }

    if (!(name.length >= 3)) {
      return res.json(error_res("Group name is too short!"));
    }

    if (!(name.length <= 25)) {
      return res.json(error_res("Group name is too long!"));
    }

    let getGroupByNameRes = await getGroupByName({ userId, name });

    if (getGroupByNameRes.flag === 1) {
      return res.json(error_res("This group name is already registered !"));
    }

    let createGroupRes = await createGroup({ userId, name });
    return res.json(createGroupRes);
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const updateGroup = async (req, res) => {
  try {
    let { name } = req.body;
    let { groupId } = req.query;
    userId = req.user._id;
    console.log("userId -> ", userId);

    const missingField = checkRequiredFields(req.body, ["name"]);

    if (missingField) return res.json(error_res(missingField));

    if (!validator.isAlpha(name)) {
      return res.json(
        error_res(
          "Please enter valid group name and do not pass numbers and symbols !"
        )
      );
    }

    if (!(name.length >= 3)) {
      return res.json(error_res("Group name is too short!"));
    }

    if (!(name.length <= 25)) {
      return res.json(error_res("Group name is too long!"));
    }

    let getGroupByNameRes = await getGroupByName({ userId, name });
    if (getGroupByNameRes.flag === 1) {
      return res.json(error_res("This group name is already registered !"));
    }

    let updateGroupRes = await doUpdateGroup(groupId, { name }, userId);
    return res.json(updateGroupRes);
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const deleteGroup = async (req, res) => {
  try {
    let groupId = req.query.groupId;
    let getUserId = req.user._id;

    let deleteGroupRes = await doDeleteGroup(groupId, getUserId);
    return res.json(deleteGroupRes);
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const groupList = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, name } = req.body;

    let startingIndex = (page - 1) * pageSize;
    let endingIndex = page * pageSize;

    const getGroupByUserIdRes = await getGroupByUserId(req?.user?._id);

    if (getGroupByUserIdRes.flag === 1) {
      return res.json(
        success_res("Group data fetch successfully ", getGroupByUserIdRes.data)
      );
    }
    // const groupListing = await getGroupByUserIdRes?.data.filter((value) => {
    //   return !name || value?.name?.toLowerCase() === name.toLowerCase();
    // });

    // const storeGroupData = {};
    // storeGroupData.data = groupListing?.slice(startingIndex, endingIndex);
    // storeGroupData.currentPage = page;
    // storeGroupData.itemPerPage = pageSize;
    // storeGroupData.totalRecord = groupListing?.length;

    // console.log("storeGroupData ----> ", storeGroupData);

    // let checkLength =
    //   groupListing?.length <= 0 ? "Group data not found !" : storeGroupData;

    // console.log("checkLength ---------> ", checkLength);

    // let renderGroupTable = await ejs.renderFile("views/Group.Table.ejs", {
    //   body: { groupsData: checkLength },
    // });
    // return res.json(
    //   success_res(
    //     "So many records have been matched from the keyword you searched !",
    //     { view: renderGroupTable }
    //   )
    // );

    // return res.json(success_res("Group data fetch successfully ", checkLength));
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

module.exports = {
  postCreateGroup,
  updateGroup,
  deleteGroup,
  groupList,
};
