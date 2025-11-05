import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/xpoint?retryWrites=true&w=majority';
const client = new MongoClient(uri);
let db: Db;

export async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('xpoint');
  }
  return db;
}

export async function getCollection(collectionName: string) {
  const database = await connectToDatabase();
  return database.collection(collectionName);
}



