const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
import { error } from './utils'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const getTestMessageUrl = nodemailer.getTestMessageUrl

export const sendMail = async (from: any, to: any, subject: any, text: any, html: any) => {
  try {
    await sgMail.send({
      from: from,
      to,
      subject: `${subject}`,
      text: `${text}`,
      html: `${html}`
    })
    console.log(`mail sent to "${to}" : for "${subject} : with "${text}"`)
    return true
  } catch (e) {
    console.log(e)
    throw error(500, 'Error While Sending Mail')
  }
}

