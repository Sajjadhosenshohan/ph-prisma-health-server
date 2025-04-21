import nodemailer from "nodemailer";
import config from "../config";
const sendEmail = async (email:string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.env === "development" ? 587 : 465,
    secure: config.env === "development" ? false : true, // true for port 465, false for other ports
    auth: {
      user: config.email_sender.email,
      pass: config.email_sender.app_pass,
    },
  });

  await transporter.sendMail({
    from: '"PH-health-service👻" <mdshohansajjad@gmail>', // sender address
    to: email, // list of receivers
    subject: "Reset password link ", // Subject line
    // text: "Hello world?", // plain text body
    html: link// html body
  });
};

export default sendEmail
