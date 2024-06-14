const mongoose = require("mongoose");
const { success_res, error_res } = require("../library/general");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    name: { type: String },
    mobileNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

const contactModel = mongoose.model("contact", contactSchema);

const createContact = async (contactData) => {
  try {
    let response = await contactModel.create(contactData);

    return response
      ? success_res("Contact data created successfully!", response)
      : error_res("Contact data not created!");
  } catch (error) {
    return error_res(error.message);
  }
};

const doUpdateContact = async (contactId, contactBodyData, userId) => {
  try {
    let response = await contactModel.findOneAndUpdate(
      { $and: [{ _id: contactId }, { userId: userId }] },
      { $set: contactBodyData }
    );
    return response
      ? success_res("Contact data updated successfully!")
      : error_res("You don't have permission to update this contact data!");
  } catch (error) {
    return error_res(error.message);
  }
};

const doDeleteContact = async (contactId, userId) => {
  try {
    let response = await contactModel.findOneAndDelete({
      $and: [{ _id: contactId }, { userId: userId }],
    });
    return response
      ? success_res("Contact data deleted successfully!")
      : error_res("You don't have permission to delete this contact data!");
  } catch (error) {
    return error_res(error.message);
  }
};

const getContactByUserId = async (userId) => {
  try {
    let response = await contactModel.find({ userId: userId });
    return response
      ? success_res("Records found for the given userId!", response)
      : error_res("No contact found!");
  } catch (error) {
    return error_res(error.message);
  }
};

const getContactByMobileNum = async ({ userId, mobileNumber }) => {
  try {
    let response = await contactModel.findOne({
      $and: [{ userId: userId }, { mobileNumber: mobileNumber }],
    });
    return response
      ? success_res("Record found for the given userId and name!", response)
      : error_res("No contact found!");
  } catch (error) {
    return error_res(error.message);
  }
};

const getAllContact = async () => {
  try {
    let response = await contactModel.find();
    return response
      ? success_res("All contact find successfully!", response)
      : error_res("No contacts found");
  } catch (error) {
    return error_res(error.message);
  }
};

module.exports = {
  createContact,
  doUpdateContact,
  doDeleteContact,
  getContactByUserId,
  getContactByMobileNum,
  getAllContact,
};
