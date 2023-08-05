/* eslint-disable no-unused-vars */
// Data Abstraction Layer [ DAL ] File
//import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

//const uri = "mongodb://164.92.85.169/27017/&ssl=false";
//const uri = "mongodb://localhost/27017";
const uri = "mongodb+srv://pardovmarco:8RpH0ODRSpjsBDkw@cluster0.bs2zqyr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { useUnifiedTopology: true });

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

export async function createUser( name, email, password, sudo ) {
    try {
        const client = new MongoClient(uri);
        const database = client.db("myProject");
        const collection = database.collection("users");
        // create a document to insert
        const doc = {"name":name, "email":email, "password": password, "balance" : 0, "admin" : sudo};
        const result = await collection.insertOne(doc,{w:1});
        console.log(`New listing created with the follwoing id: ${result.insertedId} and SUDO: ${sudo}`)
        return result;
    } finally {
        await client.close();
    }
  }

  export async function all(){
    const client = new MongoClient(uri);

    await client.connect();
// Cambiar "myProject" a 27017 para mongo in the cloud
    const allUsers = await client.db('myProject').collection('users').find({}, {projection:{ _id: 0 }}).toArray();


    if (allUsers){
        console.log(`All Users: ${allUsers}`);
    }else{
        console.log(`No existing users`);
    }
    await client.close();
    return JSON.stringify(allUsers)
}

export async function search(email){
  const client = new MongoClient(uri);

  client.connect();

  const result   = await client.db("myProject").collection("users").find(
    { email:email },
    { projection:{ _id: 0, name: 0, balance:0, admin:0 } },
  ).toArray();

  if(result){
      console.log('DAL OK ' );
  }else{
      console.log('not found')
  }
  
  await client.close();
  return JSON.stringify(result)
}

export async function login(email){
  const client = new MongoClient(uri);

  client.connect();

  const result   = await client.db("myProject").collection("users").find(
    { email:email },
    { projection:{ _id: 0 } },
  ).toArray();

  if(result){
      console.log('DAL OK ', result );
  }else{
      console.log('not found')
  }
  
  await client.close();
  return JSON.stringify(result)
}

export async function update( email, balance) {
  try {
      const client = new MongoClient(uri);
      client.connect();
      // Update a document a document to insert
      const result = await client.db("myProject").collection("users").updateOne( {email:email} , { $set: {balance : balance} } );
      console.log(`Updated as: ${result.modifiedCount}`)
      return result;
  } finally {
      await client.close();
  }
}

export async function balance(email){
  const client = new MongoClient(uri);

  client.connect();

  const result   = await client.db("myProject").collection("users").find(
    { email:email },
    { projection:{ _id: 0, name: 0, email: 0, password:0, admin:0 } },
  ).toArray();

  if(result){
      console.log('DAL Balance OK ', result );
  }else{
      console.log('not found')
  }
  await client.close();
  return JSON.stringify(result)
}