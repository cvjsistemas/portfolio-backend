import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({path:'.env'});

import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 8080;



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const transporter = nodemailer.createTransport(
//   nodemailerSendgrid({
//     auth: {
//       api_key: process.env.API_SENDGRID,
//     },
//   })
// );


const transporter = nodemailer.createTransport({
  //service: 'Gmail',
  host:'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
      type:'login',
      user:process.env.EMAIL,
      pass: process.env.PASS_APLI_GMAIL
  }
});

app.post("/sendemail", (req, res) => {
  const { name, email, jobtypes, message } = req.body;

  if(!name){
    return res.status(400).json({error: "Please add your name"});
  }
  
  if(!email){
    return res.status(400).json({error: "Please add your email"});
  }

    
  if(!jobtypes){
    return res.status(400).json({error: "Please add jobtypes"});
  }
  if(!message){
    return res.status(400).json({error: "Please add your message"});
  }

  const options={
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Job Offers",
    html: `
        
        <h5>Details Information:</h5>

        <ul>
        <li> <p>Name: ${name}</p> </li>
        <li> <p>E-mail: ${email}</p> </li>
        <li> <p>Job Types: ${jobtypes}</p> </li>
        <li> <p>Message: ${message}</p> </li>


        </ul>

        `,

  }

// Send Email
transporter.sendMail(options, (err, resp) => {
  if (err) {
    // handle error
    res.status(404).json({error:err});
  } else {
    // handle success
    res.status(200).json({ success: "Your e-mail has been sent"})
  }
});

 

});

app.listen(PORT, (req, res) => {
  console.log(`Server Connected in PORT ${PORT}`);
});
