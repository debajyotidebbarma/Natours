const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user,url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Debajyoti Debbarma <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    //}
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  async send(template, subject) {
    //Send the actual email
    //1)) REnder the html based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2))Define the mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //3)) create a transport and send email
    // this.newTransport();

    try {
      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      console.log('sendmailerror', err);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      `passwordReset`,
      `your password reset token (valid for only 10 minutes)`
    );
  }
};

// const sendEmail = async (options) => {
//   //1))Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   // 2)) Define the email options
//   const mailOptions = {
//     from: 'Debajyoti Debbarma <ddd@meowy.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,

//   };
//   //3))Send the email with node mailer
//   await transporter.sendMail(mailOptions);
// };
