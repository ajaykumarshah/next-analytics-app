// lib/database.js
import { MongoClient } from 'mongodb';

const connectionInfo={
  db:"",
  connected:false
}

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  if(connectionInfo.connected){
    return connectionInfo.db
  }
  else{
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      const db=client.db(process.env.DB_NAME);
      connectionInfo.db=db;
      connectionInfo.connected=true
      return db
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }

  }
}

const connectToDatabaseAndThenGetCollection=async(collection)=>{
  const db = await connectToDatabase();
  return db.collection(collection);
}

export { connectToDatabase,connectToDatabaseAndThenGetCollection };
