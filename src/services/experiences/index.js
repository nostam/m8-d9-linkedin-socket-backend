const express = require("express");
const app = express.Router()
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../../config/cloudinary")
const ExperienceSchema = require("../../schemas/experiece_schema")
const ProfileSchema = require("../../schemas/profile_schema")
const requestIp = require('request-ip');



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: process.env.FOLDER_NAME,
      allowedFormats: ["jpg", "png", "jpeg"],
    },
})


const multerCloudinary = multer({
    "storage": storage
})
 /// First one is done
app.get('/:userName', async (req, res, next) => {
    try {
        const profile = await ProfileSchema.findOne({username:req.params.userName})
        const experince = await ExperienceSchema.find({username:profile._id}).populate("username")
        console.log(req.params.userName)

        
        
         res.send(experince)
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});
/// second one is done
app.get('/:userName/exp/:expId', async (req, res, next) => {
    try {
        const profile = await ProfileSchema.findOne({username:req.params.userName})
        const experince = await ExperienceSchema.findById(req.params.expId)
        console.log(experince)
        res.send(experince)
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});
/// waaait
app.get('/:id/cv', async (req, res, next) => {
    try {

    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});
/// post is done
app.post('/:username/exp', async (req, res, next) => {
    try {
        
        const profile = await ProfileSchema.findOne({username:req.params.username})
        console.log(profile,"asdasd")
        
        if(profile){
            const newExperience = {...req.body,username:profile._id}
            console.log(newExperience)
           
            const myExp = new ExperienceSchema(newExperience)
            await myExp.save()
           res.send(myExp)

        
        }else{
            res.send("false")
        }

        
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});

app.post('/:userName/exp/:expId/upload', multerCloudinary.single("image"),async (req, res, next) => {
    try {
        const addPicture = await ExperienceSchema.findByIdAndUpdate(req.params.id, {
          $set: {
            image: req.file.path,
          },
        });
        if (addPicture) {
          res.status(200).send(addPicture);
        } else {
          const err = new Error();
          err.message = `Profile Id: ${req.params.id} not found`;
          err.httpStatusCode = 404;
          next(err);
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
});
/// put is done
app.put('/:userName/exp/:expId', async (req, res, next) => {
    try {
        const modifed = await ExperienceSchema.findByIdAndUpdate(req.params.expId,{...req.body})
        console.log(modifed)
        res.send(modifed)
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});

app.delete('/:userName/exp/:expId', async (req, res, next) => {
    try {
        const deleteExperice = await ExperienceSchema.findByIdAndDelete(req.params.expId)
        console.log(deleteExperice)
        res.send(deleteExperice)
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});


module.exports = app