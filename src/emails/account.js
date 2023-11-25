const nodemailer = require('nodemailer');
const { google } = require('googleapis');


const CLIENT_ID = '890712100607-d4pqv2st1u2fqf2698q0hsqmrnaunhvk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//049nvgvijkjWcCgYIARAAGAQSNwF-L9IrZxjW9pXIdGn0Uq5IvkfHbvNFnTYiQXDqqCcEXQY5nE35XNricbLISdgnssCsmpNvsXQ';


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });




// const sendMail = transporter.sendMail(mailOptions, (error,info) => {
//     if(error) {
//         console.log(error);
//     }
//     else
//     {
//         console.log('Email sent: ' + info.response);
//     }
// });

const sendMail = async (email, name, num) => {
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

    // transporter.sendMail(mailBody, (error,info) => {
    //     if(error) {
    //         console.log("From account.js line 42 ",error);
    //     }
    //     else
    //     {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
    try{
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'agrotrader10@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const info = await transporter.sendMail(mailBody);
        console.log("Email sent ", info.response);
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = sendMail;