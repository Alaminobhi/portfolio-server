const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edvmx.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000

app.get('/', (req, res)=>{
  res.send('wellcome To Database Connect Successful')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("portfolio").collection("projects");
 
app.post('/addProject', (req, res)=>{
    const newItem =req.body;
    collection.insertOne(newItem)
    // collection.insertMany(newItem)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
})

app.get('/projects',(req, res)=>{
    collection.find({category: 'project'})
    .toArray( (err, documents)=>{
        res.send(documents);
    })
})

app.get('/blogs',(req, res)=>{
  collection.find({category: 'blog'})
  .toArray( (err, documents)=>{
      res.send(documents);
  })
})

app.get('/project/:id',(req, res)=>{
    const id = ObjectID(req.params.id);
    collection.find({_id: id})
    .toArray( (err, documents)=>{
        res.send(documents[0]);
    })
})


// app.delete('deleteItem/:id', (req, res)=>{
//   const id = ObjectID(req.params.id);
//   collection.findOneAndDelete({_id: id})
//   .then(documents => res.send(!!documents))
//   .catch(err => {
//     console.log(err);
//   })
// })


});


app.listen(process.env.PORT || port)