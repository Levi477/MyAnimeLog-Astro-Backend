const User = require('./Users');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/login-system-test');
mongoose.connect("mongodb+srv://leviAckerman:deep0904@videotube.in6sxwa.mongodb.net/?retryWrites=true&w=majority&appName=VideoTube");

const createUser = async (username,password) => {
    try {
        await User.create({
            username: username,
            password: password,
            createdAt: Date.now(),
            comments: [],
            rating: []
        })
        return 1;
    } catch (error) {
        console.log("Error creating user : " + error);
        return null;
    }
}

const findUser = async (username) => {
    try {
        const user = await User.findOne(
            {
                username: username,
            }
        )

        if(user){
            console.log("user found");
            return user;
        }
        else{
            console.log("user not found");
            return null;
        }
    } catch (error) {
        console.log("Error finding user : " + error);
        return null;
    }
}

const adminGetUsers = async () => {
    try {
        const users = await User.find({})
        if(users){
            console.log("users found");
            console.log(users);
            return users;
        }
        else{
            console.log("Currently no registered users.");
            return null;
        }
    } catch (error) {
        console.log("Error fetching users : " + error);
        return null;
    }
}

const saveComment = async (username,anime,comment) => {
    try{
        const user = await User.findOne({
            username: username
        })
        if(user){
            user.comments.push({createdAt: Date.now(),data: comment,anime: anime})
            await user.save()
            return 1;
        }
            return null;
        }
        catch(error){
            console.log("Error occured while saving comment : " + error);
            return null;
    }
}

const saveRating = async (username,anime,rating) => {
    try {
        const user = await User.findOne({
            username: username
        })
        if(user){
            user.ratings.push({anime: anime,rating: rating})
            await user.save()
            return 1;
        }
        return null;
    } catch (error) {
        console.log("Error occured while saving rating : " + error);
        return null;
    }
}

const updateRating = async (username,anime,rating) => {
    try {
        await User.updateOne(
            {username: username,'ratings.anime': anime},
            {$set: {'ratings.$.rating': rating}}
        );
        return 1
    } catch (error) {
        console.log(error);
        return null
    }
}
module.exports = {createUser,findUser,adminGetUsers,saveComment,saveRating,updateRating}

