const nodemailer = require('nodemailer');



async function config(toMail, subject,text){
    // create an email transporter.
    // SMTP
   const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "user_E-Mail",
            pass: "user_Password"
        }
    })

    // configure email content 

    const mailOptions = {
        from :"user_E-Mail",
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

