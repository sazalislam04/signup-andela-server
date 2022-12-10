const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
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

app.put("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedDoc = {
      $set: {
        user,
      },
    };
    const result = await usersCollection.updateOne(filter, updatedDoc, options);
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
