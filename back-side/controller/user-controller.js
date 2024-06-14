const {
  checkRequiredFields,
  error_res,
  isEmailValid,
  mobileNumValidation,
  success_res,
} = require("../library/general");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
let randomstring = require("randomstring");

const {
  getUserByEmailOrMobilenum,
  createUser,
  doUpdateUser,
  doDeleteUser,
  doGetUser,
  getAllUser,
  getEmailAndUpdateOtp,
  getUserByOtp,
  getUserByToken,
  getUserIdByPasswordUpdate,
  getUserByUpdatePassword,
} = require("../model/user-model");

const { sendVerificationEmail } = require("../Nodemailer");

const postUserSignup = async (req, res) => {
  try {
    let { username, email, mobileNumber, password, confirmPassword } = req.body;

    let missingField = checkRequiredFields(req.body, [
      "username",
      "email",
      "mobileNumber",
      "password",
      "confirmPassword",
    ]);
    if (missingField) {
      return res.json(error_res(missingField));
    }

    if (!validator.isAlpha(username)) {
      return res.json(
        error_res(
          "Please enter valid Username and do not pass numbers and symbols !"
        )
      );
    }

    if (username.length < 3) {
      return res.json(error_res("username must be three characters long !"));
    }

    if (!isEmailValid(email))
      return res.json(error_res("Please enter a valid email address!"));

    let mobileNumValRes = await mobileNumValidation(mobileNumber);
    if (mobileNumValidation(mobileNumber))
      return res.json(error_res(mobileNumValRes));

    if (password.length < 5)
      return res.json(
        error_res("Password must be at least 5 characters long!")
      );

    if (password.length > 15) return res.json(error_res("Password too long!"));

    if (password !== confirmPassword)
      return res.json(error_res("Passwords do not match!"));

    req.body.password = await bcrypt.hash(password, 10);

    if (!req.body.otp) {
      req.body.otp = "";
    }

    if (!req.body.token) {
      req.body.token = "";
    }

    if (!req.body.googleId) {
      req.body.googleId = "";
    }

    let userExistsRes = await getUserByEmailOrMobilenum(email, mobileNumber);

    if (userExistsRes.flag === 1)
      return res.json(error_res("This user is already registered !"));

    let createUserRes = await createUser(req.body);
    return res.json(createUserRes);
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const postUserLogin = async (req, res) => {
  try {
    const { username, password, remember_me } = req.body;

    const missingField = checkRequiredFields(req.body, [
      "username",
      "password",
    ]);

    if (missingField) return res.json(error_res(missingField));

    const userExistsRes = await getUserByEmailOrMobilenum(username, username);

    if (userExistsRes.flag === 0) {
      return res.json(userExistsRes);
    }

    if (userExistsRes.flag === 1) {
      let checkPassword = await bcrypt.compare(
        password,
        userExistsRes?.data?.password
      );
      if (!checkPassword) {
        return res.json(error_res("Your password is incorrect !"));
      }
    }

    let token;
    if (remember_me === true) {
      token = jwt.sign({ id: userExistsRes.data._id }, "USER-AUTHENTICATION");
    } else {
      token = jwt.sign({ id: userExistsRes.data._id }, "USER-AUTHENTICATION", {
        expiresIn: "24h",
      });
    }

    return res.json(success_res("User login successully !", token));
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const updateUser = async (req, res) => {
  try {
    let id = req.query.userId;
    let { username, email, mobileNumber, password, confirmPassword } = req.body;
    let missingField = checkRequiredFields(req.body, [
      "username",
      "email",
      "mobileNumber",
      "password",
      "confirmPassword",
    ]);
    if (missingField) {
      return res.json(error_res(missingField));
    }

    if (!validator.isAlpha(username)) {
      return res.json(
        error_res(
          "Please enter valid Username and do not pass numbers and symbols !"
        )
      );
    }

    if (username.length < 3) {
      return res.json(error_res("username must be three characters long !"));
    }

    if (!isEmailValid(email))
      return res.json(error_res("Please enter a valid email address!"));

    let mobileNumValRes = await mobileNumValidation(mobileNumber);
    if (mobileNumValidation(mobileNumber))
      return res.json(error_res(mobileNumValRes));

    if (password.length < 5)
      return res.json(
        error_res("Password must be at least 5 characters long!")
      );

    if (password !== confirmPassword)
      return res.json(error_res("Passwords do not match!"));

    req.body.password = await bcrypt.hash(password, 10);

    let userExistsRes = await getUserByEmailOrMobilenum(email, mobileNumber);

    if (userExistsRes.flag === 1)
      return res.json(error_res("This user is already registered !"));

    let updateUserRes = await doUpdateUser(id, req.body);
    if (updateUserRes?.flag === 1) {
      return res.json(success_res("User updated successfully !"));
    }
  } catch (error) {
    return res.json(error_res(err.message));
  }
};

const deleteUser = async (req, res) => {
  try {
    let id = req.query.userId;
    let deleteUserRes = await doDeleteUser(id);
    if (deleteUserRes?.flag === 1) {
      return res.json(success_res("User deleted successfully !"));
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const getUser = async (req, res) => {
  try {
    let id = req.query.userId;
    let getUserRes = await doGetUser(id);
    if (getUserRes?.flag === 1) {
      return res.json(getUserRes);
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const getUserList = async (req, res) => {
  try {
    let getAllUserRes = await getAllUser();
    if (getAllUserRes?.flag === 1) {
      return res.json(success_res("All user data found!", getAllUserRes.data));
    } else {
      return res.json(error_res(getAllUserRes.msg));
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const postForgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.json(error_res("Please enter your email"));
    }

    if (!isEmailValid(email))
      return res.json(error_res("Please enter a valid email address!"));

    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });

    let postRandomString = randomstring.generate({
      charset: "alphabetic",
      length: 5,
    });

    await sendVerificationEmail(email, otp, postRandomString);

    let updateOtp = await getEmailAndUpdateOtp(email, otp, postRandomString);

    if (updateOtp?.flag === 1) {
      return res.json(success_res("verification code sent successfully"));
    } else {
      return res.json(error_res("Failed to send verification code"));
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const postUserOtp = async (req, res) => {
  try {
    let { otp } = req.body;
    if (!otp) {
      return res.json(error_res("Please fill out this field"));
    }

    let getOtp = await getUserByOtp(otp);
    if (getOtp?.flag === 1) {
      return res.json(
        success_res("Otp mathced successfully", { token: getOtp.data.token })
      );
    } else {
      return res.json(
        error_res("Invalid OTP. Please check your code and try again.")
      );
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

const postUserResetPassword = async (req, res) => {
  try {
    let { newPassword, confirmPassword } = req.body;
    const { token } = req.query;

    if (!token) return res.json(error_res("Token is missing"));

    if (!newPassword || !confirmPassword)
      return res.json(error_res("Please fill out all fields"));

    if (newPassword.length < 5)
      return res.json(
        error_res("New password must be at least 5 characters long")
      );

    if (newPassword.length > 15)
      return res.json(error_res("Password too long"));

    if (newPassword !== confirmPassword)
      return res.json(error_res("Passwords do not match"));

    let getUserByTokenRes = await getUserByToken(token);

    if (getUserByTokenRes.flag === 0)
      return res.json(error_res("You are not authorized"));

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const getUserIdByPasswordUpdateRes = await getUserByUpdatePassword(
      getUserByTokenRes.data._id,
      hashedPassword
    );

    if (getUserIdByPasswordUpdateRes.flag === 1) {
      return res.json(success_res("Password updated successfully"));
    } else {
      return res.json(error_res("Failed to update password"));
    }
  } catch (error) {
    return res.json(error_res(error.message));
  }
};

module.exports = {
  postUserSignup,
  postUserLogin,
  updateUser,
  deleteUser,
  getUser,
  getUserList,
  postForgotPassword,
  postUserOtp,
  postUserResetPassword,
};
