import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT Payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  }
  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object { jwt: myjwt}
  const session = {jwt: token};
  // turn that session into json
  const sessionJSON = JSON.stringify(session);
  // take json and encode it as base64 
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string that the cookie with the encoded data
  return [`express:sess=${base64}`];
};
