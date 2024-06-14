const validator = require("validator");

const checkRequiredFields = (data, fields) => {
  let missingField = fields.find((field) => !data[field]) || null;
  if (missingField) {
    return `Please provide ${missingField}!`;
  }
};
const error_res = (message) => ({
  flag: 0,
  msg: message,
  data: {},
});

const success_res = (message, value) => ({
  flag: 1,
  msg: message,
  data: value ? value : {},
});

const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const mobileNumValidation = (mobileNum) => {
  const cleanNumber = mobileNum.replace(/\D/g, "");
  if (!validator.isNumeric(cleanNumber)) {
    return "Mobile numbers allows only digits !";
  }

  if (!(mobileNum.length >= 6 && mobileNum.length <= 10)) {
    return "Mobile number must be 6 to 10 digits !";
  }

  const regexPattern = /^[0-9]{6,10}$/;
  let checkNumber = regexPattern.test(mobileNum);

  if (!checkNumber) {
    return "Please enter valid contact number! ";
  }
  return null;
};

module.exports = {
  checkRequiredFields,
  error_res,
  success_res,
  isEmailValid,
  mobileNumValidation,
};
