const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const cartDBCollection = client.db("martialArt").collection("cart")
        const userDBCollection = client.db("martialArt").collection("user")

        //post a cart data to mongodb

        app.post("/users", async (req, res) => {
            const userBody = req.body;
            const query = { email: userBody.email }

            const existingUser = await userDBCollection.findOne(query)
            console.log("Existing User: ", existingUser);
            if (existingUser) {
                return res.send({ meassage: "User Already Exist" })
            }
            const result = await userDBCollection.insertOne(userBody)
            res.send(result)
        })

        //get user from mongodb

        app.get("/users", async (req, res) => {
            const query = {}
            const classes = userDBCollection.find(query)
            const result = await classes.toArray()
            res.send(result)
        })

        //update user to admin 

        app.patch("/users/admin/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }

            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await userDBCollection.updateOne(filter, updateDoc)
            res.send(result);
        })
        //update user to instructor

        app.patch("/users/instructor/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }

            const updateDoc = {
                $set: {
                    role: 'instructor'
                },
            };
            const result = await userDBCollection.updateOne(filter, updateDoc)
            res.send(result);
        })

        // identify admin from db

        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userDBCollection.findOne(query)
            const result = { admin: user?.role === 'admin' }

            res.send(result);
        })
        // identify instructor from db

        app.get("/users/instructor/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userDBCollection.findOne(query)
            const result = { instructor: user?.role === 'instructor' }

            res.send(result);
        })

        //get data from class json in db
        app.get("/classes", async (req, res) => {
            const query = {}
            const classes = classDBCollection.find(query)
            const result = await classes.toArray()
            res.send(result)
        })

        //update classes by user here

        //post data to classes from instructor json in db
        app.post("/classes", async (req, res) => {
            const body = req.body;

            const result = await classDBCollection.insertOne(body)
            res.send(result)
        })
        //get data from instructor json in db
        app.get("/instructors", async (req, res) => {
            const query = {}
            const classes = instructoDBCollection.find(query)
            const result = await classes.toArray()
            res.send(result)
        })

        //post a cart data to mongodb

        app.post("/carts", async (req, res) => {
            const cartBody = req.body;
            const result = await cartDBCollection.insertOne(cartBody)
            res.send(result)
        })

        //get a cart data to mongodb
        app.get("/carts", async (req, res) => {
            const email = req.query.email

            if (!email) {
                res.send([])
            }
            const query = { email: email }
            const classes = cartDBCollection.find(query)
            const result = await classes.toArray()
            res.send(result)
        })
        //delete cart data from db
        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartDBCollection.deleteOne(query)
            res.send(result);
        })

    } finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Martial Art is running At Port: ${port}`);
})