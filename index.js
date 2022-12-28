const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.biy4zxs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
     try{
          const tasksCollection = client.db('taskManagement').collection('tasks')

          app.get('/tasks',async(req, res)=>{
               const query = {}
               const tasks = await tasksCollection.find(query).toArray()
               res.send(tasks)
          })

     }
     finally{

     }
}
run().catch(err=>console.error(err))


app.get('/', (req, res)=>{
     res.send('task management server is running!!')
})

app.listen(port, ()=>{
     console.log(`port is running at ${port}`)
})