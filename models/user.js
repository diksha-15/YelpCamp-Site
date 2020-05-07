var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");


var userschema = new mongoose.Schema({
	username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true,
    unique: true
  },
	password: {
    type: String,
  }
});

userschema.plugin(passportlocalmongoose);

module.exports = mongoose.model("user" , userschema);