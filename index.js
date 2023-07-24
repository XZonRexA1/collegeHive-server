const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1fwa7gk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    // college collection
    const collegeCollection = client.db("collegeDB").collection("college");
    const addCollegeCollection = client
      .db("collegeDB")
      .collection("addCollege");

    // review collection
    const addReviewCollection = client.db("collegeDB").collection("addReview");
    // userinfo collection
    const userInfoCollection = client.db("collegeDB").collection("userInfo");

    // college related api
    app.get("/college", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

    // add college details info
    app.get("/addCollege", async (req, res) => {
      const result = await addCollegeCollection.find().toArray();
      res.send(result);
    });
    app.post("/addCollege", async (req, res) => {
      const addCollege = req.body;
      const result = await addCollegeCollection.insertOne(addCollege);
      res.send(result);
    });

    // review related apis
    app.get("/addReview", async (req, res) => {
      const result = await addReviewCollection.find().toArray();
      res.send(result);
    });
    app.post("/addReview/:id", async (req, res) => {
      const addReview = req.body;
      const result = await addReviewCollection.insertOne(addReview);
      res.send(result);
    });

    // user related apis

    // get user info
    app.get("/userInfo", async (req, res) => {
      const result = await userInfoCollection.find().toArray();
      res.send(result);
    });

    // post user info
    app.post("/userInfo", async (req, res) => {
      const userInfo = req.body;
      const result = await userInfoCollection.insertOne(userInfo);
      res.send(result);
    });


    app.put("/userInfo", async (req, res) => {
      const updatedData = req.body;
      const filter = { _id: updatedData._id }; 
      delete updatedData._id; 
      const updateDoc = {
        $set: updatedData,
      };
      try {
        const result = await userInfoCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating user info:", error);
        res.status(500).send("Error updating user info.");
      }
    });

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("college Hive is running");
});

app.listen(port, () => {
  console.log(`College Hive is running on port ${port}`);
});
