import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer'; // Importa Nodemailer
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(cors({
  origin: 'https://alexargese.github.io', // Dominio del frontend
  methods: 'GET,POST',
}));


app.use(express.json());

// Configura il trasporto di Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puoi usare altri servizi come Outlook o configurare un SMTP personalizzato
  auth: {
    user: process.env.EMAIL_USER, // Il tuo indirizzo email
    pass: process.env.EMAIL_PASS, // La password dell'email (usa app password se necessario)
  },
});

// Endpoint per inviare email
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email, // Email del mittente (l'utente che compila il form)
    to: 'argesealex@gmail.com', // Il tuo indirizzo email per ricevere i messaggi
    subject: `New message from ${name}`, // Oggetto dell'email
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Contenuto del messaggio
  };

  // Invia l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully!');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
