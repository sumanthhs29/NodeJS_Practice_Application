// const { htmlToText } = require("html-to-text");
const nodemailer = require("nodemailer");
const pug = require("pug");

//Generic class for sending mails
module.exports = class Email {
  constructor(user, url) {
    this.to = user.emailId;
    this.firstName = user.name;
    this.url = url;
    this.from ='checkt420@gmail.com'; //sendGrid sender{change it as per requirement}
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user:"apikey", //sendGrid sender user
        pass:"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", //sendGrid sender password
      },
    });

  }

  //Send the actual email
  async send(template, subject) {
    //1. Render HTML based on a template{for now i m using pug template}
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    //2.Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html),
      text: "hello",
    };

    //3.Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  //function which is used to send forgotPassword email
  async sendPasswordReset() {
    await this.send("emails", "Your Password Reset Token(Valid for 10 min)");
  }
};