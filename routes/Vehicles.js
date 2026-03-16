const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/auth');

router.post('/add', verifyToken, async (req,res)=>{
    const { plate_number, fuel_type } = req.body;
    const vehicle_id = uuidv4();
    await pool.query(
        'INSERT INTO vehicles (vehicle_id, user_id, plate_number, fuel_type) VALUES ($1,$2,$3,$4)',
        [vehicle_id, req.user_id, plate_number, fuel_type]
    );
    res.json({message:"Vehicle added", vehicle_id});
});

router.get('/list', verifyToken, async (req,res)=>{
    const vehicles = await pool.query('SELECT * FROM vehicles WHERE user_id=$1',[req.user_id]);
    res.json({vehicles:vehicles.rows});
});

router.post('/transfer', verifyToken, async (req,res)=>{
    const { vehicle_id, new_mobile_number } = req.body;
    const newUser = await pool.query('SELECT * FROM users WHERE mobile_number=$1',[new_mobile_number]);
    if(newUser.rows.length===0) return res.status(400).json({error:"New owner not registered"});
    await pool.query('UPDATE vehicles SET user_id=$1 WHERE vehicle_id=$2',[newUser.rows[0].user_id, vehicle_id]);
    res.json({message:"Vehicle transferred"});
});

module.exports = router;
