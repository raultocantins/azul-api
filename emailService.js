const nodemailer = require('nodemailer');

// Configura o transporte para o serviço de e-mail (por exemplo, Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'smtp' se não estiver usando Gmail
    auth: {
        user: 'djmarceloto@gmail.com', // Substitua pelo seu e-mail
        pass: 'vpsvvjonvrmcmiwf',           // Substitua pela sua senha ou app password
    },
});

// Função para enviar e-mail
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'djmarceloto@gmail.com', // E-mail do remetente
        to: to,
        subject: subject,
        text: text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
