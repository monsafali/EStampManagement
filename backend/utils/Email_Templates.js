export const ADC_WELCOME_TEMPLATE = ({ fullname, username, password }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADC Admin Account Created</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">

  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden;">

    <div style="background: linear-gradient(to right, #1a73e8, #4285f4); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Welcome to E-Stamp System</h1>
    </div>

    <div style="padding: 20px;">

      <p>Hello <strong>${fullname}</strong>,</p>

      <p>Your ADC Admin account has been successfully created. Below are your login details:</p>

      <div style="background:#f1f1f1;padding:15px;border-radius:5px;margin:20px 0;">
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p>Please keep these credentials safe. You can now log in to the E-Stamp system using the provided details.</p>

      <p>If you have any issues, contact system support.</p>

      <p>Regards,<br><strong>E-Stamp Team</strong></p>

    </div>

    <div style="text-align: center; padding: 15px; font-size: 12px; color: gray;">
      <p>This is an automated email. Do not reply.</p>
    </div>
  </div>

</body>
</html>
`;



export const Vendor_WELCOME_TEMPLATE = ({ fullname, username, password }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E_StampVendor Management System Account Created</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">

  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden;">

    <div style="background: linear-gradient(to right, #46b937, #318b35); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Welcome to E-Stamp System</h1>
    </div>

    <div style="padding: 20px;">

      <p>Hello <strong>${fullname}</strong>,</p>

      <p>Your E_StampVendor account has been successfully created. Below are your login details:</p>

      <div style="background:#f1f1f1;padding:15px;border-radius:5px;margin:20px 0;">
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p>Please keep these credentials safe. You can now log in to the E-Stamp system using the provided details.</p>

      <p>If you have any issues, contact system support.</p>

      <p>Regards,<br><strong>E-Stamp Team</strong></p>

    </div>

    <div style="text-align: center; padding: 15px; font-size: 12px; color: gray;">
      <p>This is an automated email. Do not reply.</p>
    </div>
  </div>

</body>
</html>
`;



export const LOGIN_OTP_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Login OTP</title>
</head>

<body style="
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">

  <!-- Header -->
  <div style="
    background: linear-gradient(to right, #0066ff, #0099ff);
    padding: 20px;
    text-align: center;
  ">
    <h1 style="color: white; margin: 0;">Login OTP</h1>
  </div>

  <!-- Body -->
  <div style="
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  ">
    <p>Hello,</p>
    <p>Use the One-Time Password (OTP) below to log in to your account:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #0066ff;
      ">{otp}</span>
    </div>

    <p>This OTP is valid for <b>5 minutes</b>.</p>
    <p>If you didn't request this login attempt, please ignore this email.</p>

    <p>Regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="
    text-align: center;
    margin-top: 20px;
    color: #888;
    font-size: 0.8em;
  ">
    <p>This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
`;



export const VENDOR_DEACTIVATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Deactivated</title>
</head>

<body style="
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">

  <!-- Header -->
  <div style="
    background: linear-gradient(to right, #ff4d4d, #cc0000);
    padding: 20px;
    text-align: center;
  ">
    <h1 style="color: white; margin: 0;">Account Deactivated</h1>
  </div>

  <!-- Body -->
  <div style="
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  ">
    <p>Hello <b>{fullname}</b>,</p>

    <p>Your vendor account has been <b>deactivated</b> due to certain reasons.</p>

    <p>If you believe this is a mistake or need more information, please contact the administrator for further queries.</p>

    <p>Regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="
    text-align: center;
    margin-top: 20px;
    color: #888;
    font-size: 0.8em;
  ">
    <p>This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
`;


export const VENDOR_ACTIVATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Activated</title>
</head>

<body style="
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">

  <!-- Header -->
  <div style="
    background: linear-gradient(to right, #28a745, #218838);
    padding: 20px;
    text-align: center;
  ">
    <h1 style="color: white; margin: 0;">Account Activated</h1>
  </div>

  <!-- Body -->
  <div style="
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  ">
    <p>Hello <b>{fullname}</b>,</p>

    <p>We are pleased to inform you that your vendor account has been <b>successfully activated</b>.</p>

    <p>You can now log in and continue using all features of the system without any restrictions.</p>

    <p>If you face any issues, feel free to contact our support team.</p>

    <p>Regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="
    text-align: center;
    margin-top: 20px;
    color: #888;
    font-size: 0.8em;
  ">
    <p>This is an automated message. Please do not reply.</p>
  </div>

</body>
</html>
`;



export const Vendor_Password_Change_TEMPLATE = ({
  fullname,
  username,
  newPassword,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Updated – E-Stamp Vendor Management System</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">

  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden;">

    <div style="background: linear-gradient(to right, #46b937, #318b35); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Password Updated Successfully</h1>
    </div>

    <div style="padding: 20px;">

      <p>Hello <strong>${fullname}</strong>,</p>

      <p>Your password for the E-Stamp Vendor system has been successfully updated. Below are your updated credentials:</p>

      <div style="background:#f1f1f1;padding:15px;border-radius:5px;margin:20px 0;">
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>New Password:</strong> ${newPassword}</p>
      </div>

      <p>If you did not request this change, please contact the system administrator immediately.</p>

      <p>Regards,<br><strong>E-Stamp Team</strong></p>

    </div>

    <div style="text-align: center; padding: 15px; font-size: 12px; color: gray;">
      <p>This is an automated email. Do not reply.</p>
    </div>
  </div>

</body>
</html>
`;
