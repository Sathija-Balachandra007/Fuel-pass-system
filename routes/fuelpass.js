const express = require('express');
const router = express.Router();
const pool = require('../db');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/auth');
const moment = require('moment');

router.post('/generate', verifyToken, async (req,res)=>{
    const { vehicle_id } = req.body;
    const fuel_balance = 50;
    const pass_id = uuidv4();
    const qr_payload = JSON.stringify({pass_id, vehicle_id, fuel_balance});
    const qr_code_data = await QRCode.toDataURL(qr_payload);

    await pool.query(
        'INSERT INTO fuelpass (pass_id, vehicle_id, qr_code_data, fuel_balance, expiry_date) VALUES ($1,$2,$3,$4,$5)',
        [pass_id, vehicle_id, qr_code_data, fuel_balance, moment().add(30,'days').format('YYYY-MM-DD')]
    );
    res.json({qr_code_data});
});

router.post('/recover', verifyToken, async (req,res)=>{
    const { vehicle_id } = req.body;
    const fuelpass = await pool.query('SELECT * FROM fuelpass WHERE vehicle_id=$1',[vehicle_id]);
    if(fuelpass.rows.length===0) return res.status(400).json({error:"Fuel pass not found"});
    res.json({qr_code_data: fuelpass.rows[0].qr_code_data});
});

module.exports = router;
