const { createUser, findUser, adminGetUsers } = require("./db/db");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});

app.route("/api/login").post(async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const user = await findUser(req.body.username);
    if (user !== null) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (passwordMatch) {
        res.json({
          success: true,
          message: "Login successful!",
          username: req.body.username,
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Incorrect Password!" });
      }
    } else {
      res
        .status(401)
        .json({
          success: false,
          message: "Incorrect Username, try Registering !",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }
});

app.route("/api/register").post(async (req, res) => {
  console.log("Received data:", req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await createUser(req.body.username, hashedPassword);

    if (user !== null) {
      res.json({
        success: true,
        message: "User Registered Successfully",
        username: req.body.username,
      });
    } else {
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

app.route("/api/user/:username").get(async (req, res) => {
  try {
    const user = await findUser(req.params.username);
    if (user) {
      res.json({
        success: true,
        username: user.username,
        password: user.password,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

app.route("/api/users").get(async (req, res) => {
  try {
    const users = await adminGetUsers();
    if (users) {
      res.json({ success: true, users: users });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
