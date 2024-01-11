const nodemailer = require('nodemailer');



async function config(toMail, subject,text){
    // create an email transporter.
    // SMTP
   const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "snehatiwari972@gmail.com",
            pass: "fkarhrshclskjweo"
        }
    })

    // configure email content 

    const mailOptions = {
        from :"snehatiwari972@gmail.com",
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

// const config = {
// emailUser: 'snehatiwari972@gmail.com',
// emailPassword: 'fkarhrshclskjweo'
// }
// module.exports = config;