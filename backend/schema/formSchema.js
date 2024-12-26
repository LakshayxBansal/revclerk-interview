const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
    name: {type:String , required:true},
    email : {type:String, required: true},
    phone : {type: String, required:true},
    aadhar : {type: String, required:true}
})

const FormData = mongoose.model('FormData' , formDataSchema);

module.exports = FormData;