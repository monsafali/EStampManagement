


export const setTokenCookieAndSend = (
  res,
  user,
  statusCode = 200,
  message = "Success"
) => {
  const token = user.generateJsonWebToken();
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;
  return res
    .status(statusCode)
    .cookie("jwt-token", token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
      sameSite: 'lax'

    })
    .json({ success: true, message, user, token });
};
