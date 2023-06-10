const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');

require('dotenv').config()
const app = express()
const cors = require('cors');

const port = process.env.PORT || 11000;

// midleware

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Martial Art Server Running")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yaanftr.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const classDBCollection = client.db("martialArt").collection("class")
        const instructoDBCollection = client.db("martialArt").collection("instructor")

        //get data from class json in db
        app.get("/classes", async (req, res) => {
            const query = {}
            const classes = classDBCollection.find(query)
            const result = await classes.toArray()
            res.send(result)
        })
        //get data from instructor json in db
        app.get("/instructors", async (req, res) => {
            const query = {}
            const classes = instructoDBCollection.find(query)
            const result = await classes.toArray()
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Martial Art is running At Port: ${port}`);
})