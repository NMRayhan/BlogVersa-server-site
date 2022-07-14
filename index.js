const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rch82.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res) => {
    res.send('Hello World!')
})

async function run() {
    const BlogCollections = client.db("BlogVersa").collection("Blogs");
    const categoryCollection = client.db("BlogVersa").collection("category")
    try {
        client.connect()

        //get all blogs for every user for Home page
        app.get('/allBlogs', async (req, res) => {
            const result = await BlogCollections.find().toArray();
            res.send(result);
        })

        //get user posted blog flter by email for ManageUserControl
        app.get('/userBlogs/:email', async (req, res) => {
            const email = req.params.email;
            const query = { blogEmail: email };
            const result = await BlogCollections.find(query).toArray();
            res.send(result);
        })

        //get blog category API
        app.get('/category', async (req, res) => {
            const result = await categoryCollection.find().toArray();
            res.send(result);
        })

        //delete Blog by indivisual user
        app.delete('/deleteBlog/:blog_id', async (req, res) => {
            const id = req.params.blog_id;
            const filter = { _id: ObjectId(id) };
            const result = await BlogCollections.deleteOne(filter);
            res.send(result);
        })

        //update blog by indivisual user



    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})