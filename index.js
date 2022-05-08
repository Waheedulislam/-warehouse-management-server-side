const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;
const app = express();

//meddleWare
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uv8zw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    console.log('mongo is running');
    try {
        await client.connect();
        const itemCollection = client.db("wareHouse").collection("products");

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const item = await cursor.toArray();
            res.send(item)
        });
        app.get('/itemDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        })

        // POST
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })

        // post 
        app.put('/addQuantity', async (req, res) => {
            const id = req.params.id;
            const oldQuantity = parseInt(req.query.oldQuantity);
            const newQuantity = parseInt(req.body.quantity);

            const totalQuantity = oldQuantity + newQuantity;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: totalQuantity.quantity
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        // put update  user
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedUser.newQuantity
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        // Delete
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is Running')
});
app.listen(port, () => {
    console.log('server is Running');
})
