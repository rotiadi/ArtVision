const {insertLogIntoDb} = require('../middlewares/db')

const insertLogs = async (req, res, next ) => {
   
    const event = {
        "Time:": new Date(),
        "EndPoint:": req.originalUrl,
        "Body:": req.body,
        "Auth Token:": req.headers["authorization"]?.split(" ")[1]
    }
    
    console.log(event);
     
    await insertLogIntoDb(event);

    next();
    
}

module.exports = insertLogs;