const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("signup andela server running");
});

// mongodb
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.bts619l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Send Email
const emailSender = (user) => {
  const { fname, email, role } = user;
  const transport = nodemailer.createTransport({
    host: process.env.HOST_KEY,
    port: 587,
    auth: {
      user: process.env.EMAIL_KEY,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: '"The Andela Recruitment Team" <noreply@uptal.org>',
    to: email,
    subject: "Thank you for applying with us",
    html: `
    <div style="width: 50%; margin: 0 auto; padding: 10px">
    <img
      style="width: 30%; height: 30%; margin-bottom: 20px"
      src="https://i.ibb.co/4FYq5Rx/unnamed.png"
      alt=""
    />
    <div style="line-height: 1.6">
      <h2 style="color: #58002f">${fname}</h2>
      <p>${role}</p>
      <p style="color: #58002f">
        Thank you for applying to the Andela Talent Network. We appreciate
        your interest in joining us and we want to thank you for the time and
        energy you invested in applying.
      </p>
      <p>
        Md Sazal, Thank you for applying to the Andela Talent Network. We
        appreciate your interest in joining us and we want to thank you for
        the time and energy you invested in applying. Our Talent Network is
        currently only looking for applicants with over 3 years of experience.
        However, according to your experience, we think we can help you grow
        your skills and would like you to join the Andela Learning Community
        (ALC) .
      </p>
      <h3 style="color: #58002f">With the ALC you'll be able to:</h3>
      <ul>
        <li>
          Access in-demand technology courses from our learning partners such
          as Google and Microsoft.
        </li>
        <li>
          Build skills and grow in your career. Curate your professional
          profile and showcase your skills.
        </li>
        <li>Grow your reach and increase your circle of influence.</li>
      </ul>
      <h3>The Andela Recruitment Team</h3>
    </div>
    <span
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 50px;
      "
      >Andela, Inc</span
    >
  </div>
    `,
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

async function dbConnect() {
  try {
    client.connect();
    console.log("databse connect");
  } catch (error) {
    console.log(error.message);
  }
}
dbConnect();

const usersCollection = client.db("andela").collection("users");
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const result = await usersCollection.insertOne(user);

    // send email for submit confirmation
    emailSender(user);
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
