
import User from '../models/citizen.model.js';
import  axios  from 'axios';

import jwt from 'jsonwebtoken'




export const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const { email, name, picture } = googleRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (err) {
    console.error("GOOGLE AUTH FAILED:", err.response?.data || err.message);
    res.status(401).json({ message: "Google authentication failed" });
  }
};
