const jwt = require('jsonwebtoken');
const JWT_SECRET = "KalaPelaNeela";

// middleware 3 cheeje leta h req, res, next- iska naam agle fn ko call krna hota h -- like iske baad turant async fn call ho jaega
const fetchuser = (req, res, next) => {
    // receiving auth token from header to get data using token
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: 'Please authenticate using valid token'});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        // console.log(data)
        next();
    } catch (error) {
        res.status(401).send({error: 'Please authenticate using valid token'});
    }
}

module.exports = fetchuser;