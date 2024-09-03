const mongoose = require("mongoose");
const { success_res, error_res } = require("../library/general");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const groupModel = mongoose.model("group", groupSchema);

const createGroup = async (groupData) => {
  try {
    let response = await groupModel.create(groupData);

    return response
      ? success_res("Group data created successfully.", response)
      : error_res("Group data not created!");
  } catch (error) {
    return error_res(error.message);
  }
};

const getGroupByName = async ({ userId, name }) => {
  try {
    let response = await groupModel.findOne({
      $and: [{ userId: userId }, { name: name }],
    });

    return response
      ? success_res("Records found for the given userId and name!", response)
      : error_res("No group data found!");
  } catch (error) {
    return error_res(error.message);
  }
};

const doUpdateGroup = async (groupId, groupData, userId) => {
  try {
    let response = await groupModel.findOneAndUpdate(
      { $and: [{ _id: groupId }, { userId: userId }] },
      { $set: groupData }
    );
    return response
      ? success_res("Group data updated successfully!")
      : error_res("You don't have permission to update this group data!");
  } catch (error) {
    return error_res(error.message);
  }
};

const doDeleteGroup = async (groupId, userId) => {
  try {
    let response = await groupModel.findOneAndDelete({
      $and: [{ _id: groupId }, { userId: userId }],
    });

    return response
      ? success_res("Group data deleted successfully!")
      : error_res("You don't have permission to delete this group data!");
  } catch (error) {
    return error_res(error.message);
  }
};

const getGroupByUserId = async (userId) => {
  console.log("userId -> ", userId);
  try {
    let response = await groupModel.find({ userId: userId });
    console.log("response --> ", response);

    return response
      ? success_res("Records found for the given userId!", response)
      : error_res("No group data found!");
  } catch (error) {
    return error_res(error.message);
  }
};

module.exports = {
  createGroup,
  getGroupByName,
  doUpdateGroup,
  doDeleteGroup,
  getGroupByUserId,
};
