require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Quang Truong Dev" <quangtruongle369@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: `
        <h3>xin chào ${dataSend.patientName}!</h3>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div>
        <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
        </div>
        `
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''

    if (dataSend.language === 'vi') {
        result =
            `
        <h3>xin chào ${dataSend.patientName}!</h3>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div>
        <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
        </div>
        `


    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>hello ${dataSend.patientName}!</h3>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <div><b>Time: ${dataSend.time}</b></div>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        `


    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>xin chào ${dataSend.patientName}!</h3>
        
        
        <div>
        <p>Ban nhan duoc email nay vi dat lich kham benh online cua chung toi</p>
        </div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>xin chào ${dataSend.patientName}!</h3>
        
        
        <div>
        <p>Ban nhan duoc email nay vi dat lich kham benh online cua chung toi</p>
        </div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let info = await transporter.sendMail({
                from: '"Quang Truong Dev" <quangtruongle369@gmail.com>',
                to: dataSend.email,
                subject: "Thông tin đặt lịch khám bệnh",
                html: `
                <h3>xin chào ${dataSend.patientName}!</h3>
                
                
                <div>
                <p>Ban nhan duoc email nay vi dat lich kham benh online cua chung toi</p>
                </div>
                `,
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imageBase64.split("base64,")[1],
                        encoding: 'base64'
                    },

                ],
            });
            resolve(true);
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    //getBodyHTMLEmail: getBodyHTMLEmail
    sendAttachment: sendAttachment

}
