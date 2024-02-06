const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

class mailer {
  constructor() {}
  async sendMail(from, to, subject, template, data) {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "anupamnodejs1@gmail.com",
          pass: "hpcumnlwnjxghuzm",
        },
      });
      const html = await ejs.renderFile(
        path.join(__dirname, "../views", template),
        data
      );

      // setup the mail options
      let mail_options = {
        from,
        to,
        subject,
        html,
      };
      // fire the mail
      return await transporter.sendMail(mail_options);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
module.exports = new mailer();
