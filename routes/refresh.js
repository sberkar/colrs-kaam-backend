const router = require("express").Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const User = require("../models/user");

router.post("/", (req, res, next) => {
  const rtc = req.cookies.rtc;

  if (!rtc)
    return res.status(401).json({
      message: "Authentication Required",
    });

  User.findOne({ refreshToken: rtc })
    .then((user) => {
      if (!user) {
        res.clearCookie("rtc", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.status(404).json({ message: "user not found" });
      }

      jwt.verify(rtc, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: "Re-authenticate",
          });
        }
        const accessToken = jwt.sign(
          {
            email: decoded.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        return res.status(200).json({ accessToken });
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
