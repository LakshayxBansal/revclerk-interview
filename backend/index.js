const express = require('express');
const mongoose = require('mongoose');
const { z } = require('zod');
const FormData = require('./schema/formSchema');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');



dotenv.config();
const app = express();

app.use(cors({
    origin:
    'http://localhost:5173',
    methods: ['GET','POST'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL);

const formSchema = z.object({
    name: z.string().min(3,"Name must be of atleast 3 letters"),
    email: z.string().email("Invalid email"),
    phone : z.string().length(10,"Phone number must of 10 digits"),
    aadhar : z.string().length(12,"Aadhar must be of 12 digits")
})


// app.post('/submit',async(req,res)=>{
//     try{
//         const validateData = formSchema.parse(req.body);
//         const {aadhar} = validateData;
//         let user = await FormData.findOne({aadhar});
//         if(user){
//             await User.updateOne({aadhar},validateData);
//             res.status(200).json({message:"User updated successfully",user : validateData});
//         }else{
//             const newUser = new FormData(validateData);
//             await newUser.save();
//             res.status(201).json({
//                 message:"User created successfully",user:validateData
//             });
//         }
        
//     }catch(error){
//         message:"error while submitting the form"
//     }
// })

app.post('/submit', async (req, res) => {
    try {
        const validateData = formSchema.parse(req.body);
        const { aadhar } = validateData;
        let user = await FormData.findOne({ aadhar });
        if (user) {
            await FormData.updateOne({ aadhar }, validateData);  // Fix: Use FormData model
            res.status(200).json({ message: "User updated successfully", user: validateData });
        } else {
            const newUser = new FormData(validateData);
            await newUser.save();
            res.status(201).json({ message: "User created successfully", user: validateData });
        }
    } catch (error) {
        res.status(400).json({
            message: "Error while submitting the form",
            errors: error.errors || [error.message]
        });
    }
});


app.get('/user/:aadhar',async(req,res)=>{
    try{
        const {aadhar} = req.params;
        const user = await FormData.findOne({aadhar});
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({
                message:"No user found in database"
            })
        }
    }catch(error){
        res.status(500).json({
            message:"Internal server error",error
        })
    }
})

const PORT = process.env.PORT || 5001;
app.listen(PORT,() => {
    console.log(`Server running on port : ${PORT}`);
});