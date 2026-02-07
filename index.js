const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

// username: healthCare
// password: P0RjuvzZAj2ZOmDh

const uri = "mongodb+srv://healthCare:P0RjuvzZAj2ZOmDh@cluster0.dmwbpii.mongodb.net/?appName=Cluster0";

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

    console.log("Trying to connect to MongoDB...");

    await client.connect();

    const db = client.db('healthCare')
    const modelCollection = db.collection('appointments');
    
    //find
    // findOne

    app.get('/appointments', async (req, res) => {
        const result = await modelCollection.find().toArray() // promise
        res.send(result)
    })


    app.post('/appointments', async(req, res) => {
    try {
        console.log('Data from client', req.body);

        const result = await modelCollection.insertOne(req.body);
        console.log('Insert result', result);
        res.send({
            success: true,
            result
        });
    } catch (error) {
        console.error('Error inserting appointment:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is running fine!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
