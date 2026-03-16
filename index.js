require('dotenv').config();
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

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

    const db = client.db('healthCare');
    const modelCollection = db.collection('appointments');
    const bannerCollection = db.collection('banners');
    const reviewCollection = db.collection('reviews')
    const serviceCollection = db.collection('services')
    const blogCollection = db.collection('blogs')
    const expensesCollection = db.collection('expenses')
    const usersCollection = db.collection('users')
    const incomeCollection = db.collection("income");

    //find
    // findOne

    // Banners data
    app.get('/banners', async (req, res) => {
      try {
        const result = await bannerCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


    // Reviews data
    app.get('/reviews', async (req, res) => {
      try {
        const reviews = await reviewCollection.find().toArray();
        res.send(reviews)
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


    // Services data
    app.get('/services', async (req, res) => {
      try {
        const services = await serviceCollection.find().toArray();
        res.send(services);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.get('/services/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const service = await serviceCollection.findOne({ _id: new ObjectId(id) });
        if (!service) {
          return res.status(404).send({ error: 'Service not found' });
        }
        res.send(service);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post('/services', async (req, res) => {
      try {
        const result = await serviceCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post("/expenses", async (req, res) => {

      const expense = req.body;

      const result = await expensesCollection.insertOne(expense);

      res.send(result);

    });

    app.get("/expenses", async (req, res) => {
      try {
        const result = await expensesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.put("/expenses/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateData = { ...req.body };
        delete updateData._id; // Remove _id to prevent MongoDB error
        const updatedDoc = {
          $set: updateData
        };
        const result = await expensesCollection.updateOne(filter, updatedDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.delete("/expenses/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await expensesCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.get("/income", async (req, res) => {

      const result = await incomeCollection.find().toArray();

      res.send(result);

    });

    // Users data
    app.get('/api/users', async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Get user role by email
    app.get('/api/users/role', async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) return res.status(400).send({ error: 'Email required' });
        const user = await usersCollection.findOne({ email });
        if (!user) return res.send({ role: 'user' });
        res.send({ role: user.role || 'user' });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post('/api/users', async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
          return res.send({ message: 'User already exists', insertedId: null });
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.put('/api/users/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            ...req.body
          }
        };
        const result = await usersCollection.updateOne(filter, updatedDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.delete('/api/users/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
    // blog data
    app.get('/blogs', async (req, res) => {
      try {
        const blogs = await blogCollection.find().sort({ _id: -1 }).toArray();
        res.send(blogs);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // single blog
    app.get('/blogs/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
          return res.status(404).send({ error: 'Blog not found' });
        }

        res.send(blog);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // insert one blog
    app.post("/blogs", async (req, res) => {
      try {
        const result = await blogCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // blog many post
    app.post('/blogs/many', async (req, res) => {
      try {
        const result = await blogCollection.insertMany(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


    // Appointments
    app.get('/appointments', async (req, res) => {
      const result = await modelCollection.find().toArray() // promise
      res.send(result)
    })

    app.post('/appointments', async (req, res) => {
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

    app.delete('/appointments/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await modelCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


    // Root
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running fine!')
})

module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

