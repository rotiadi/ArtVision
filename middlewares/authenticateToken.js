const e = require("express");
const jwt = require("jsonwebtoken");


const authenticateToken =  async (req, res, next) => {

  const token = req.cookies.token;
  const refreshToken = req.cookies.tokenRefresh;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        // regenerate the token
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decodedRefresh) => {
          if (err) {
            return res.status(403).json({ message: "Failed to authenticate token" });
          }
          else {
                     
            newAccessToken = jwt.sign(
              { userName: decodedRefresh.userName, email: decodedRefresh.email, id: decodedRefresh.id },
              process.env.JWT_SECRET,
              {
                algorithm: "HS512",
                expiresIn: '10s',
              }
            );

            
            req.username = decodedRefresh.email;
            req.id_user = decodedRefresh.id;
            req.email = decodedRefresh.email;

          }


        });


        res.cookie('token', newAccessToken, { httpOnly: true });
        console.log('Token regenerated');
        next();
      }
      else {
        return res.status(403).json({ message: "Failed to authenticate token", err: err });
      }
    }
    else {
      req.username = decoded.email;
      req.id_user = decoded.id;
      req.email = decoded.email;

      next();
    }

    
  });
};

module.exports = authenticateToken;