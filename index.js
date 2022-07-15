const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const commentCollection = client.db("BlogVersa").collection("Comment");
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

        //save blog by user into database
        app.post('/addBlog', async (req, res) => {
            const blog = req.body;
            const result = await BlogCollections.insertOne(blog);
            res.send(result);
        });

        //get update blog by indivisual user
        app.get('/blog/update/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const result = await BlogCollections.findOne(query)
            res.send(result)
        })

        //update blog by user
        app.put('/updateBlog/:_id', async (req, res) => {
            const id = req.params._id;
            const blog = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: blog,
            };
            const result = await BlogCollections.updateOne(
                filter,
                updatedDoc,
                options
            );
            res.send(result)
        })

        //user comment a blog post
        app.post('/postComment', async(req, res)=>{
            const comment = req.body
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        })

        //get comment filter by blog id
        app.get('/comments/:blogId', async(req, res)=>{
            const blogId = req.params.blogId;
            const query = { blogId: blogId };
            const result = await commentCollection.find(query).toArray();
            res.send(result);
        })


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})