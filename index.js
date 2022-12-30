const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
               const tasks = await tasksCollection.find(query).toArray();
               res.send(tasks)
          })

          app.get('/myTask', async(req, res)=>{
               let query = {}
               if(req.query.email){
                    query={
                         email:req.query.email,
                         status:'running'       
                    }
               }
               const myTask = await tasksCollection.find(query).toArray()
               res.send(myTask)
          })

          app.get('/completedTask', async(req, res)=>{
               let query = {}
               if(req.query.email){
                    query={
                         email:req.query.email,
                         status: 'complete'
                    }
               }
               const completedTask = await tasksCollection.find(query).toArray()
               res.send(completedTask)
          })

          app.post('/tasks', async(req, res)=>{
               const query = req.body;
               const result = await tasksCollection.insertOne(query);
               res.send(result)
          })

          app.put('/myTask/:id', async(req, res)=>{
               const id = req.params.id;
               const filter = {_id:ObjectId(id)}
               const option = {upsert: true}
               const updatedDoc = {
                    $set: {
                         status: 'complete'
                    }
               }
               const result = await tasksCollection.updateOne(filter,updatedDoc, option)
               res.send(result)
          })

          app.put('/NotCompleteTask/:id', async(req, res)=>{
               const id = req.params.id;
               const filter = {_id:ObjectId(id)}
               const option = {upsert: true}
               const updatedDoc = {
                    $set:{
                         status: 'running'
                    }
               }
               const result = await tasksCollection.updateOne(filter, updatedDoc, option)
               res.send(result)
          })

          app.delete('/myTask/:id', async(req, res)=>{
               const id = req.params.id;
               const filter = {_id: ObjectId(id)}
               const result = await tasksCollection.deleteOne(filter)
               res.send(result)
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