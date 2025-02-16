const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../config/db.js')
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/middleware.js");
const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
	const { rows } = await db.query("SELECT * from users");
	res.send(rows[0]);
});

router.get("/profile/:id", verifyToken, async (req, res) => {
    try {
	const { id } = req.params;
	const { rows } = await db.query("SELECT * FROM users where id = $1", [id]);
	if (rows.rowCount <= 0) {
		res.status(400).send("User Could not be found");
	}
	res.send(rows[0]);
    }
    catch(error) {
        return res.status(400).send({
            error: error,
            message: error.message,
            stack: error.stack
        });
    }
});
router.post("/register", async (req, res) => {
    //console.log("Received Body:", req.body); // 🔍 Debugging log

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(401).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        res.json({ message: "USER REGISTERED SUCCESSFULLY", user: result.rows[0] });
    } catch (err) {
        console.error("Error in /register:", err); // 🔍 Debugging log
        res.status(500).json({ error: `Error: ${err.message}` });
    }
});


// Update User Details
router.put("/profile/update/:id", verifyToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { email, password } = req.body;

		const selectQuery = await db.query(
			"SELECT email, password, FROM users WHERE id = $1",
			[id]
		);

		if (!selectQuery.rowCount <= 0) {
                    return res.status(404).send({
                        message: "cannot find user"
                    })
		}

		const updatedUser = {};

		if (username) updatedUser.username = username;
		else {
			updatedUser.username = selectQuery.rows[0].username;
		}
		if (email) updatedUser.email = email;
		else {
			updatedUser.email = selectQuery.rows[0].email;
		}

		if (password) updatedUser.password = password;
		else {
			updatedUser.password = selectQuery.rows[0].password;
		}

		const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
		const updateQuery = await db.query(
			"UPDATE users SET email = $1, password = $2 WHERE user_id = $2",
			[updatedUser.username, updatedUser.email, updatedUser.password]
		);

		if (updatedUser.rowCount <= 0) {
			res.status(400).send({
				message: "Could not update",
			});
		}

		res.status(200).send({
			message: "User is updated",
			data: rows[0],
		});
	} catch (error) {
		res.status(400).send({
			error: error,
			details: error.message,
			stack: error.stack,
		});
	}
});

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await pool.query("SELECT * FROM users WHERE email = $1",[email])
        if(user.rows.length == 0) return res.status(401).json({error:"INVALID CREDENTIALS"})
        
	if (req.cookies.token) {
            try {
                jwt.verify(req.cookies.token, process.env.JWT_TOKEN);
                return res.status(400).json({ error: "User already logged in" });
            } catch (err) {
		console.error("Token expired or invalid");
            }
        }
        const isValidPassword = await bcrypt.compare(password,user.rows[0].password)

        if(!isValidPassword){
            return res.status(401).json({error:"invalid credentials"})
        }
        const token = jwt.sign(
                {
			id: user.id,
			username: user.username,
			email: user.email,
                },
                process.env.JWT_TOKEN,
                { expiresIn: "1h" }
        );
        
        if (!token) {
            return res.status(500).send({message: "Token Generation Failed"});           
        }


        res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 3600000,
                sameSite: "Strict",
        });

        res.json({message:"LOGIN SUCCESSFULL",token:token});
    }catch(err){
        return res.status(501).json({error:`Error ${err}`})
    }
})


router.post("/logout", async (req, res) => {
	try {
		res.cookie("token", "", { expires: new Date(0), httpOnly: true });
		res.send("User Logged Out Successfully");
	} catch (error) {
                res.status(400).send({
                        error: error,
                        details: error.message,
                        stack: error.stack,
                });
	}
});


// Delete User
router.delete("/delete/:id", async (req, res) => {
	const { id } = req.params;
	const query = await db.query(
		"SELECT username, email FROM users where id = $1",
		[id]
	);

	if (query.rowCount <= 0) {
		res.status(404).send({
			message: "Could not find User",
		});
	}

	const deleteQuery = await db.query("DELETE FROM users WHERE id = $1", [id]);

	if (deleteQuery.rowCount <= 0) {
		res.status(500).send({
			message: "Could not delete User",
		});
	}

	res.cookie("token", "", { expires: new Date(0), httpOnly: true });

	res.status(204).send({
		message: "User has been deleted",
	});
});

module.exports = router
