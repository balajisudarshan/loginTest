
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const token =
		req.cookies.token || req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		res.status(401).send("Access Denied");
	}

	jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
		if (err) res.status(403).send("Invalid Token");
		req.user = user;
		next();
	});
};

export default verifyToken;
