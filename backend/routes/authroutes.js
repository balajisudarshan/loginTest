const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../config/db.js')

const router = express.Router()
router.get('/',(req,res)=>{
    res.send("Register page ")
})
router.post("/register",async(req,res)=>{
    const {username,email,password} = req.body

    try{
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1",[email])
        if(existingUser.rows.length > 0){
            return res.status(401).json({error:"User already exist"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const result = await pool.query("INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email",[username,email,hashedPassword])
        res.json({message:"USER REGISTERED SUCCESSFULLY",user:result.rows[0]})
    }catch(Err){
        res.status(501).json({error:`Error : ${Err}`})
    }

})
router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await pool.query("SELECT * FROM users WHERE email = $1",[email])
        if(user.rows.length == 0) return res.status(401).json({error:"INVALID CREDENTIALS"})
        
        const isValidPassword = await bcrypt.compare(password,user.rows[0].password)

        if(!isValidPassword){
            return res.status(401).json({error:"invalid credentials"})
        }

        res.json({message:"LOGIN SUCCESSFULL",user:{id:user.rows[0].id,username:user.rows[0].username,email:user.rows[0].email}})
    }catch(err){
        return res.status(501).json({error:`Error ${err}`})
    }
})
module.exports = router