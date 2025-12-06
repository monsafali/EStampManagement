
import User from '../models/citizen.model.js';
import  axios  from 'axios';

import jwt from 'jsonwebtoken'



import oauth2Client from '../utils/googleClient.js';

export const googleAuth = async (req, res, next) => {
  const code = req.query.code;

  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }

    const token = jwt.sign(
      { _id: user._id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({
      message: "success",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.response?.data || err.message,
    });
  }
};
