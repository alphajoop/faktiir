import clientPromise from './mongodb';
import { Email } from '../models/Email';

export async function saveEmail(email: string): Promise<Email> {
  const client = await clientPromise;
  const db = client.db(); // ou le nom de votre base de données

  const newEmail = {
    email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('emails').insertOne(newEmail);
  return { ...newEmail, _id: result.insertedId.toString() };
}

export async function getEmails(): Promise<Email[]> {
  const client = await clientPromise;
  const db = client.db();

  const emails = await db
    .collection('emails')
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return emails.map((email) => ({
    _id: email._id.toString(),
    email: email.email,
    createdAt: new Date(email.createdAt),
    updatedAt: new Date(email.updatedAt),
  }));
}
