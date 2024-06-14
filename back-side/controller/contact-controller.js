const {
  error_res,
  checkRequiredFields,
  mobileNumValidation,
} = require("../library/general");
const validator = require("validator");
const {
  getContactByMobileNum,
  createContact,
  doUpdateContact,
  doDeleteContact,
  getContactByUserId,
  getAllContact,
} = require("../model/contact-model");

const postContact = async (req, res) => {
  try {
    let { name, mobileNumber } = req.body;

    userId = req?.user?._id;

    const missingField = checkRequiredFields(req.body, [
      "name",
      "mobileNumber",
    ]);

    if (missingField) return res.json(error_res(missingField));

    if (!validator.isAlpha(name)) {
      return res.json(
        error_res(
          "Please enter valid contact name and do not pass numbers and symbols !"
        )
      );
    }

    if (!(name.length <= 25)) {
      return res.json(error_res("Contact name is too long!"));
    }
    const mobileNumValRes = mobileNumValidation(mobileNumber);
    if (mobileNumValRes) {
      return res.json(error_res(mobileNumValRes));
    }

    let getContactByMobileNumRes = await getContactByMobileNum({
      userId,
      mobileNumber,
    });
    if (getContactByMobileNumRes.flag === 1) {
      return res.json(error_res("This number is already registered !"));
    }

    let createContactRes = await createContact({
      userId,
      name,
      mobileNumber,
    });

    return res.json(createContactRes);
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const updateContact = async (req, res) => {
  try {
    let { name, mobileNumber } = req.body;
    let contactId = req.query.contactId;
    let userId = req.user?._id;

    const missingField = checkRequiredFields(req.body, [
      "name",
      "mobileNumber",
    ]);
    if (missingField)
      return res.json(error_res(`Please provide ${missingField}!`));

    if (!validator.isAlpha(name)) {
      return res.json(
        error_res(
          "Please enter valid contact name and do not pass numbers and symbols !"
        )
      );
    }

    if (!(name.length <= 25)) {
      return res.json(error_res("Contact name is too long!"));
    }

    const mobileNumValRes = mobileNumValidation(mobileNumber);
    if (mobileNumValRes) {
      return res.json(error_res(mobileNumValRes));
    }

    let getContactByMobileNumRes = await getContactByMobileNum({
      userId,
      mobileNumber,
    });

    if (
      getContactByMobileNumRes.flag === 1 &&
      getContactByMobileNumRes.data._id.toString() !== contactId
    ) {
      return res.json(error_res("This number is already registered !"));
    }

    let updateContactRes = await doUpdateContact(
      contactId,
      {
        name,
        mobileNumber,
      },
      userId
    );

    return res.json(updateContactRes);
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const deleteContact = async (req, res) => {
  try {
    let contactId = req.query.contactId;
    let userId = req.user?._id;

    let deleteContactRes = await doDeleteContact(contactId, userId);
    return res.json(deleteContactRes);
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const getContact = async (req, res) => {
  try {
    let getContactByUserIdRes = await getContactByUserId(req.user._id);
    if (getContactByUserIdRes?.flag === 1) {
      return res.json(getContactByUserIdRes);
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const contactList = async (req, res) => {
  try {
    let getAllContactRes = await getAllContact();
    if (getAllContactRes?.flag === 1) {
      return res.json(getAllContactRes);
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

module.exports = {
  postContact,
  updateContact,
  deleteContact,
  getContact,
  contactList,
};
