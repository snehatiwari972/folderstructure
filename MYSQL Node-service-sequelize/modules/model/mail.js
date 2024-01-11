const nodemailer = require('nodemailer');



async function config(toMail, subject,text){
    // create an email transporter.
    // SMTP
   const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "Your_User_Email",
            pass: "Your_Password_without_space"
        }
    })

    // configure email content 

    const mailOptions = {
        from :"Your_User_Email",
        to : toMail,
        subject: subject,
        text: text
    }

    try {
        transporter.sendMail(mailOptions);
        console.log("Email Send Successfully");
    } catch (error) {
        console.log("Email send failed with error:", error);
    }
}

// sendMail();
module.exports = config;
