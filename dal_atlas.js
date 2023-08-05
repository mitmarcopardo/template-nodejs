/* eslint-disable no-unused-vars */
// Data Abstraction Layer [ DAL ] File
//import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://pardovmarco:8RpH0ODRSpjsBDkw@cluster0.bs2zqyr.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

export async function createUser( name, email, password ) {
    try {
        const client = new MongoClient(uri);
        const database = client.db("myProject");
        const collection = database.collection("users");
        // create a document to insert
        const doc = {name, email, password, balance : 0};
        const result = await collection.insertOne(doc,{w:1});
        console.log(`New listing created with the follwoing id: ${result.insertedId}`)
        return result;
    } finally {
        await client.close();
    }
  }

  export async function all(){
    const client = new MongoClient(uri);

    await client.connect();

    const allUsers = await client.db('myProject').collection('users').find({}, {projection:{ _id: 0 }}).toArray();


    if (allUsers){
        console.log(`All Users: ${allUsers}`);
    }else{
        console.log(`No existing users`);
    }
    await client.close();
    return JSON.stringify(allUsers)
}

export async function login(email, password){
    const client = new MongoClient(uri);

    client.connect();

    const result   = await client.db("myProject").collection("users").find({email:email , password:password},{projection:{ _id: 0 }},
    ).toArray();

    if(result){
        console.log('Desde el backend');
        console.log(result);
    }else{
        console.log('not found')
    }
    

    return JSON.stringify(result)
}