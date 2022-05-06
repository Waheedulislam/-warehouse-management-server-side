const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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