const express = require("express");
const dataBase = require("../libraries/dataBase");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkConection } = require("../middlewares/db");

const router = express.Router();

const checkEmail = (req, res, next) => {
  if (!req.body.email) {
    return res.status(401).json({ message: `An error occured!\n NO EMAIL` });
  } else {
    if (!validator.isEmail(req.body.email)) {
      return res.status(401).json({
        message: `Your email address is not a valid one. Please enter a valid email address`,
      });
    } else {
      next();
    }
  }
};

const checkPassword = (req, res, next) => {
  if (!req.body.password) {
    return res.status(401).json({ message: "You must enter a password!" });
  } else {
    const checkResults = [];
    const minlength = {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    };
    if (!validator.isStrongPassword(req.body.password, minlength)) {
      checkResults.push({
        message: "Your paswword length must be grater then 8",
        status: false,
      });
    } else {
      checkResults.push({
        message: "Your paswword length must be grater then 8",
        status: true,
      });
    }

    const minLowercase = {
      minLength: 4,
      minLowercase: 4,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    };
    if (!validator.isStrongPassword(req.body.password, minLowercase)) {
      checkResults.push({
        message: "Your paswword must contains minimum 4 lowercase letters",
        status: false,
      });
    } else {
      checkResults.push({
        message: "Your paswword must contains minimum 4 lowercase letters",
        status: true,
      });
    }

    const minUppercase = {
      minLength: 2,
      minLowercase: 0,
      minUppercase: 2,
      minNumbers: 0,
      minSymbols: 0,
    };
    if (!validator.isStrongPassword(req.body.password, minUppercase)) {
      checkResults.push({
        message: "Your paswword must contains minimum 2 Uppercase letters",
        status: false,
      });
    } else {
      checkResults.push({
        message: "Your paswword must contains minimum 2 Uppercase letters",
        status: true,
      });
    }

    const minNumbers = {
      minLength: 1,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    };
    if (!validator.isStrongPassword(req.body.password, minNumbers)) {
      checkResults.push({
        message: "Your paswword must contains minimum 1 number",
        status: false,
      });
    } else {
      checkResults.push({
        message: "Your paswword must contains minimum 1 number",
        status: true,
      });
    }

    const minSymbols = {
      minLength: 1,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 1,
    };
    if (!validator.isStrongPassword(req.body.password, minSymbols)) {
      checkResults.push({
        message: "Your paswword must contains minimum 1 symbol",
        status: false,
      });
    } else {
      checkResults.push({
        message: "Your paswword must contains minimum 1 symbol",
        status: true,
      });
    }

    if (checkResults.filter((item) => item.status === false).length > 0) {
      return res.status(403).json({ message: checkResults });
    } else {
      next();
    }
  }
};

const translateErrorMessage = (user_name, email, error) => {
  let ret = "";
  switch (error.constraint) {
    case "users_user_name_key":
      ret = `The username ${user_name} is already in use`;
      break;
    case "users_email_key":
      ret = `The email address ${email} is already in use`;
      break;
    default:
      ret = error.detail;
      break;
  }

  return ret;
};

router.post(
  "/register",
  checkConection,
  checkEmail,
  checkPassword,
  async (req, res) => {
    let { user_name, name, email, phone, password, address, artist } = req.body;

    // check mandatory fields
    let errors = [];

    if (!name || name.length == 0) {
      errors.push({
        field: "name",
        message: "name is invalid",
      });
    }

    if (!user_name || user_name.length == 0) {
      errors.push({
        field: "user_name",
        message: "user_name is invalid",
      });
    }

    if (!password || password.length == 0) {
      errors.push({
        field: "password",
        message: "Password is invalid",
      });
    }
    if (
      !email ||
      email.length == 0 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.push({
        field: "email",
        message: "Email is invalid",
      });
    }

    if (errors.length > 0) {
      res.status(401);
      res.send({
        Status: "Invalid inputs",
        message: errors,
      });
    } else {
      if (!artist || artist.length == 0) {
        artist = 0;
      }

      const encrypt_password = await bcrypt.hash(password, 10);

      const records = await dataBase
        .query(
          `INSERT INTO users (user_name, name, email, password, phone, address, artist)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [user_name, name, email, encrypt_password, phone, address, artist]
        )
        .catch((err) => {
          res.status(500);
          res.send({
            Status: "Error",
            message: translateErrorMessage(user_name, email, err),
          });
        });

      if (records) {
        res.status(200);
        res.send({
          Status: "Success",
          message: `The user ${user_name} has been created!`,
        });
      }
    }
  }
);

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(401);
    res.send({
      Status: "Invalid inputs",
      Message: "You didn't provide username and password",
    });
  } else {
    const records = await dataBase.query(
      `select * from users where user_name = $1`,
      [userName]
    );

    if (records.rowCount === 0) {
      res.status(401);
      res.send({
        Status: "Invalid username/password",
        Message: "Login failed! Invalid user Name!",
      });
    } else {
      const passwordOk = await bcrypt.compare(
        password,
        records.rows[0].password
      );

      if (!passwordOk) {
        res.status(401);
        res.send({
          Status: "Invalid username/password",
          Message: "Login failed! Invalid password!",
        });
      } else {
        const token = jwt.sign(
          {
            userName: records.rows[0].user_name,
            email: records.rows[0].email,
            id: records.rows[0].id,
          },
          process.env.JWT_SECRET,
          {
            algorithm: "HS512",
            expiresIn: "1d",
          }
        );

        res.send({
          Status: "Success",
          key: token,
        });
      }
    }
  }
});

// I dont use it anymore
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.tokenRefresh;

  let newAccessToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided." });
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Failed to authenticate token" });
      } else {
        newAccessToken = jwt.sign(
          { userName: decoded.user_name, email: decoded.email, id: decoded.id },
          process.env.JWT_SECRET,
          {
            algorithm: "HS512",
            expiresIn: "2min",
          }
        );
      }
    });

    // Send the new access token
    res.cookie("token", newAccessToken, { httpOnly: true });
    res.json({ message: "Access token refreshed successfully!" });
  } catch (err) {
    console.log(err);

    return res.status(403).json({ message: "Invalid refresh token." });
  }
});

module.exports = router;
