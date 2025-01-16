const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { create } = require('ipfs-http-client');

// IPFS Client
const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

// MongoDB Schema
const User = require('./Model/User');

// Express App
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://dhrupesh:DK_dk@lab.pk1pccj.mongodb.net/labData")
  .then(() => console.log("Server connected to DB..."))
  .catch(err => console.log("Error in MongoDB connection: " + err));
console.log("DB connected succesfully");

const PORT = 3000;

// Key Pair Generation
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  return {
    publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
    privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
  };
}

// IPFS Functions
async function storeMessage(message) {
  const { path } = await ipfs.add(message);
  return path; // Returns IPFS hash
}

async function fetchMessage(hash) {
  const chunks = [];
  for await (const chunk of ipfs.cat(hash)) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString();
}

// Demo Workflow
app.get('/demo', async (req, res) => {
  try {
    console.log("Starting Demo Workflow...");

    // 1. Register Two Users
    console.log("Registering Users...");
    const { publicKey: publicKey1, privateKey: privateKey1 } = generateKeyPair();
    const user1 = new User({ username: 'Alice', publicKey: publicKey1, privateKey: privateKey1 });
    await user1.save();

    const { publicKey: publicKey2, privateKey: privateKey2 } = generateKeyPair();
    const user2 = new User({ username: 'Bob', publicKey: publicKey2, privateKey: privateKey2 });
    await user2.save();

    console.log("Users Registered:");
    console.log("Alice:", { publicKey: publicKey1, privateKey: privateKey1 });
    console.log("Bob:", { publicKey: publicKey2, privateKey: privateKey2 });

    // 2. Alice Sends a Message to Bob
    console.log("Encrypting and Sending Message...");
    const message = "Hello Bob! This is Alice.";
    const encryptedMessage = crypto.publicEncrypt(user2.publicKey, Buffer.from(message));
    const hash = await storeMessage(encryptedMessage.toString('base64'));

    console.log("Encrypted Message Stored on IPFS:");
    console.log("IPFS Hash:", hash);

    // 3. Bob Fetches and Decrypts the Message
    console.log("Fetching and Decrypting Message...");
    const fetchedMessage = await fetchMessage(hash);
    const decryptedMessage = crypto.privateDecrypt(
      user2.privateKey,
      Buffer.from(fetchedMessage, 'base64')
    );

    console.log("Decrypted Message:", decryptedMessage.toString());

    res.json({ 
      status: 'success',
      message: 'Demo workflow completed! Check console for details.',
      decryptedMessage: decryptedMessage.toString(),
    });
  } catch (error) {
    console.error("Error in Demo Workflow:", error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await mongoose.connection.dropDatabase(); // Reset database for demo
  console.log("MongoDB connected and database reset.");
  console.log(`Visit http://localhost:${PORT}/demo to run the demo.`);
});
