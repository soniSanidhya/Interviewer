import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.NODEMAILER, // Use an app password, not your main one
  },
});

const mailKaro = async (email, sub, bodyText, credentials) => {
  if (!process.env.EMAIL || !process.env.NODEMAILER) {
    throw new Error("Email credentials missing from environment variables.");
  }
  
  
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333;">${sub}</h2>
    <p style="font-size: 16px; color: #555;">${bodyText}</p>

    ${
      credentials
        ? `<div style="margin-top: 20px; padding: 15px; background-color: #fff; border: 1px solid #ccc; border-radius: 5px;">
            <p style="margin: 0;"><strong>Username:</strong></p>
            <pre style="background-color: #eee; padding: 10px; border-radius: 4px; font-size: 16px;">${credentials.username}</pre>

            <p style="margin: 10px 0 0;"><strong>Password:</strong></p>
            <pre style="background-color: #eee; padding: 10px; border-radius: 4px; font-size: 16px;">${credentials.password}</pre>

            <p style="color: #999; font-size: 12px; margin-top: 10px;">(Please copy manually)</p>
          </div>`
        : ""
    }

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.codeinterview.tech/" target="_blank" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
        🔗 Check Out the Platform
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #888; text-align: center;">
      This is an automated email. Please do not reply.
    </p>
  </div>
`;

  

  const mailOptions = {
    from: "Akshat Shukla <akshatvijay1302@gmail.com>",
    to: email,
    subject: sub,
    text: bodyText,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return "Sent";
  } catch (error) {
    console.error("Email sending error:", error);
    return "Not sent";
  }
};

export default mailKaro;
