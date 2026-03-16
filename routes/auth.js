const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generateOTP } = require('../utils/otp');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const otpStore = {};

router.post('/request-otp', async (req,res)=>{
    const { mobile_number } = req.body;
    if(!mobile_number) return res.status(400).json({error:"Mobile required"});
    const otp = generateOTP();
    otpStore[mobile_number] = otp;
    console.log(`OTP for ${mobile_number}: ${otp}`); // replace with SMS API in production
    res.json({message:"OTP sent"});
});

router.post('/verify-otp', async (req,res)=>{
    const { mobile_number, otp } = req.body;
    if(otpStore[mobile_number] !== otp) return res.status(400).json({error:"Invalid OTP"});
    delete otpStore[mobile_number];

    let user = await pool.query('SELECT * FROM users WHERE mobile_number=$1',[mobile_number]);
    if(user.rows.length===0){
        const result = await pool.query(
            'INSERT INTO users (user_id,mobile_number) VALUES ($1,$2) RETURNING *',
            [uuidv4(), mobile_number]
        );
        user = result;
    }

    const token = jwt.sign({user_id:user.rows[0].user_id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:user.rows[0]});
});

module.exports = router;
