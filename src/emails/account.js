const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'agrotrader10@gmail.com',
        pass: 'qrxh ghgf rnmr btbb'
    }
});

// const sendMail = transporter.sendMail(mailOptions, (error,info) => {
//     if(error) {
//         console.log(error);
//     }
//     else
//     {
//         console.log('Email sent: ' + info.response);
//     }
// });

const sendMail = (email, name, num) => {
    const mailOptions = [
        {
            subject: 'Thanks For Joining In',
            text: `Welcome to our task manager app, ${name}. Let me know how you get along with the app.`
        },
        {
            subject: 'Farewell',
            text: `Dear ${name}, we will miss you. Do tell us what we could have done better to keep you on this app.`
        }
    ];

    const mailBody = {
        from: 'agrotrader10@gmail.com',
        to: email,
        subject: mailOptions[num].subject,
        text: mailOptions[num].text
    }

    transporter.sendMail(mailBody, (error,info) => {
        if(error) {
            console.log(error);
        }
        else
        {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail;