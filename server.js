const { createUser, findUser, adminGetUsers,saveComment,saveRating,updateRating } = require("./db/db");
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
      res.json(user);
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

app.route("/api/user/:username/comment")
.post(async (req,res) => {
    try{
      const username = req.params.username
      const comment = req.body.comment
      const anime = req.body.anime
      
      const commentStatus = await saveComment(username,anime,comment)

      if(commentStatus != null){
        console.log("Comment saved succesfully");
        res.status(201).json({success: true})
      }
      else{
        console.log("error saving comment");
        res.status(404).json({success: false})
      }
    }
    catch(error){
      console.log(error);
      res.status(404).json({success: false})

    }

})

app.route("/api/comments")
.get(async (req,res) => {
  try{
    const users = await adminGetUsers();
    let comment_data = [];
    if(users != null){
      users.forEach(user => {
          comment_data.push({username: user.username,comments: user.comments})
      })
      res.json({success: true,comment_data: comment_data})
    }
    else{
      res.json({success: false})
    }
  }
  catch(error){
    res.json({success: false})
    console.log(error);
  }
})

app.route("/api/user/:username/rating")
.post(async (req,res) => {
    try{
      const username = req.params.username
      const rating = req.body.rating
      const anime = req.body.anime
      
      const ratingStatus = await saveRating(username,anime,rating);

      if(ratingStatus != null){
        console.log("Rating saved succesfully");
        res.status(201).json({success: true})
      }
      else{
        console.log("error saving rating");
        res.status(404).json({success: false})
      }
    }
    catch(error){
      console.log(error);
      res.status(404).json({success: false})

    }
  }
  )

  .put(async (req,res) => {
    try {
      const username = req.params.username;
      const anime = req.body.anime;
      const rating = req.body.rating;

      const response = await updateRating(username,anime,rating)

      if(response != null){
        console.log("rating updated ");
        res.json({success: true})
      }
      else{
        res.json({success: true})
      }

    } catch (error) {
      console.log(error);
      res.json({success: true})
    }
  })

app.route("/api/ratings")
.get(async (req,res) => {
  try{
    const users = await adminGetUsers();
    let rating_data = [];
    if(users != null){
      users.forEach(user => {
        rating_data.push({username: user.username,ratings: user.ratings})
      })
      res.json({success: true,rating_data: rating_data})
    }
    else{
      res.json({success: false})
    }
  }
  catch(error){
    res.json({success: false})
    console.log(error);
  }
})
