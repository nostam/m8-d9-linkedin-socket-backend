//const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const md5 = require("md5")
const ProfileSchema = new Schema(
    {
        name: String,
        surname: String,
        email: String,
        bio: String,
        title: String,
        area: String,
        image: String,
        username: String,
        password: String,
    },
    {
        timestamps: true,
    }
)

//ProfileSchema.plugin(passportLocalMongoose)

ProfileSchema.pre("save", function (next) {
    this.password = md5(this.password)
    next()
})


Profile_Schema = mongoose.model("profiles", ProfileSchema)

module.exports = (Profile_Schema) 