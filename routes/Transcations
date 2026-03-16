const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/auth');

router.post('/add', verifyToken, async (req,res)=>{
    const { pass_id, liters } = req.body;
    const fuelpass = await pool.query('SELECT * FROM fuelpass WHERE pass_id=$1',[pass_id]);
    if(fuelpass.rows.length===0) return res.status(400).json({error:"Fuel pass not found"});
    const newBalance = parseFloat(fuelpass.rows[0].fuel_balance)+parseFloat(liters);
    await pool.query('UPDATE fuelpass SET fuel_balance=$1 WHERE pass_id=$2',[newBalance, pass_id]);
    await pool.query('INSERT INTO fuel_transactions (transaction_id, pass_id, liters, type) VALUES ($1,$2,$3,$4)',
        [uuidv4(), pass_id, liters, 'add']);
    res.json({message:"Fuel added", fuel_balance:newBalance});
});

router.post('/consume', verifyToken, async (req,res)=>{
    const { pass_id, liters } = req.body;
    const fuelpass = await pool.query('SELECT * FROM fuelpass WHERE pass_id=$1',[pass_id]);
    if(fuelpass.rows.length===0) return res.status(400).json({error:"Fuel pass not found"});
    let newBalance = parseFloat(fuelpass.rows[0].fuel_balance)-parseFloat(liters);
    if(newBalance < 0) return res.status(400).json({error:"Not enough fuel"});
    await pool.query('UPDATE fuelpass SET fuel_balance=$1 WHERE pass_id=$2',[newBalance, pass_id]);
    await pool.query('INSERT INTO fuel_transactions (transaction_id, pass_id, liters, type) VALUES ($1,$2,$3,$4)',
        [uuidv4(), pass_id, liters, 'consume']);
    res.json({message:"Fuel consumed", fuel_balance:newBalance});
});

router.get('/history/:pass_id', verifyToken, async (req,res)=>{
    const transactions = await pool.query('SELECT * FROM fuel_transactions WHERE pass_id=$1 ORDER BY created_at DESC',[req.params.pass_id]);
    res.json({transactions:transactions.rows});
});

module.exports = router;
