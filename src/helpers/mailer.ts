import nodemailer from "nodemailer";
import User from "@/models/userModels";
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({email, emailType, userId}: any) =>{

    try {

          // create a hased token
          const hashedToken = await bcryptjs.hash(userId.toString(), 10)

          if (emailType === "VERIFY") {
              await User.findByIdAndUpdate(userId, {$set:
                  {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}})
          } else if (emailType === "RESET"){
              await User.findByIdAndUpdate(userId, {$set:
                  {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}})
          }
  

          var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "53b8499d4b865f",
              pass: "d9e35d4cdd6d1a"
            }
          });
        
          const mailOptions = {
            from: 'vivekkumarchaubey79@gmail.com', 
            to: email, 
            subject: emailType === "VERIFY" ? "Verify your Email" : "Reset your Password", 
            html: `<p>Click <a href="http://localhost:3000/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> http://localhost:3000/verifyemail?token=${hashedToken}
            </p>`
          }

          const mailResponse = await transport.sendMail(mailOptions)

          return mailResponse

        }
        
     catch (error: any) {
        throw new Error(error.message)
    }
}
    
