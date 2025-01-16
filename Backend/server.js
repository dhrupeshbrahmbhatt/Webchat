require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const User = require('./Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const aleph = require('aleph-js');
const CryptoJS = require('crypto-js');
const NodeRSA = require('node-rsa');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// const corsOptions = {
//     origin: 'https://hello-haven.onrender.com',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'], // Include any required headers
// };
app.use(cors({
  origin: 'http://localhost:5173', // or whatever your frontend URL is
  credentials: true
}));

// Connect to MongoDB
mongoose.connect("mongodb+srv://dhrupesh:DK_dk@lab.pk1pccj.mongodb.net/labData")
  .then(() => console.log("Server connected to DB..."))
  .catch(err => console.log("Error in MongoDB connection: " + err));
console.log("DB connected succesfully");

// Add this helper function for key generation
function generateEncryptionKey() {
  return CryptoJS.lib.WordArray.random(256/8).toString();
}

// Encryption and decryption functions
const encryptMessage = (message, symmetricKey) => {
  try {
    if (!message || !symmetricKey) {
      console.error('Missing message or key for encryption');
      return message;
    }

    // Use the symmetric key directly
    const encrypted = CryptoJS.AES.encrypt(message, symmetricKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return message;
  }
};

const decryptMessage = (encryptedMessage, symmetricKey) => {
  try {
    if (!encryptedMessage || !symmetricKey) {
      console.log('Missing data:', { encryptedMessage: !!encryptedMessage, key: !!symmetricKey });
      return encryptedMessage;
    }
    
    // Use the same key derivation as frontend
    const key = CryptoJS.SHA256(symmetricKey).toString();
    console.log('Decryption attempt with:', {
      encryptedMessage: encryptedMessage,
      derivedKey: key
    });

    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    
    console.log('Decryption result:', {
      success: !!decryptedStr,
      decryptedString: decryptedStr || 'Failed to decrypt'
    });

    if (decryptedStr && decryptedStr.length > 0) {
      return decryptedStr;
    }
    
    return encryptedMessage;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedMessage;
  }
};

app.post("/signup", async (req, res) => {
    console.log("Signup request received:", req.body);
    try {
        // Validate required fields
        if (!req.body.email || !req.body.password || !req.body.name) {
            return res.status(400).send("Missing required fields: email, password, and name are required");
        }

        const existingUser = await User.findOne({ email: req.body.email });
        console.log("Existing user found: " + existingUser);
        if (existingUser) {
            return res.status(400).send("Email address already in use.");
        }
        console.log("No existing user found starting to create a new user...");
        // Use a default value for saltRounds if environment variable isn't set
        const saltRounds = process.env.saltRounds ? parseInt(process.env.saltRounds) : 10;
        const hash = await bcrypt.hash(req.body.password.toString(), saltRounds);

        const EthAcc = await aleph.ethereum.new_account();
        console.log("Ethereum account created: " + EthAcc);
        const encrption = new NodeRSA({ b: 2048 });
        console.log("Encryption key created: " + encrption);
        const encryption_Private_Key = encrption.exportKey("private");
        console.log("Encryption private key created: " + encryption_Private_Key);
        const encryption_Public_Key = encrption.exportKey("public");
        console.log("Encryption public key created: " + encryption_Public_Key);

        const symmetricKey = generateEncryptionKey();
        console.log("Symmetric key created: " + symmetricKey);

        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
            private_key: EthAcc.private_key,
            public_key: EthAcc.public_key,
            mnemonics: EthAcc.mnemonics,
            address: EthAcc.address,
            type: EthAcc.type,
            encryption_Private_Key: encryption_Private_Key,
            encryption_Public_Key: encryption_Public_Key,
            symmetric_key: symmetricKey,
        };

        await User.create(user);
        console.log("User created: " + user);
        res.status(200).json({symmetric_key: symmetricKey});
    } catch (err) {
        console.error("Error:", err);
        res.sendStatus(500); // Internal Server Error
    }
})
  
  .post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Signin request received:", req.body);
      // Check if the user exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("User not found");
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Invalid credentials");
      }
  
      // If the password matches, sign-in is successful
      // Create a JWT token after successful signin
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token, user, symmetric_key: user.symmetric_key });
    } catch (err) {
      console.error("Sign In Error:", err);
      res.status(500).send("Internal Server Error");
    }
  })

  .get("/profile", verifyToken, async (req, res) => {
    if (req.user) {
      try {
        // Validate if the _id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
          return res.status(400).send("Invalid user ID");
        }
        const user = await User.findById(req.user.userId); 
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.send({ user: user });
      } catch (err) {
        return res.status(400).send("Error fetching user profile");
      }
    } else {
      return res.status(401).send("Unauthorized");
    }
  })

  .get(`/posts`, verifyToken, async (req, res) => {
    const room = "hall";
    const api_server = "https://api2.aleph.im";
    
    // Ensure valid integers for page and limit
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
  
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid page or limit values" });
    }
  
    try {
      // Fetch posts using Aleph API
      const response = await aleph.posts.get_posts('chat', {
        refs: [room], // Reference for room
        api_server: "https://api2.aleph.im"
      });
      if (response && response.posts) {
        return res.json(response.posts); // Return only the posts
      } else {
        return res.status(404).json({ error: "No posts found" });
      }
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      return res.status(500).json({ error: "Error fetching posts", details: err.message });
    }
  })

  .get(`/posts/:name`, verifyToken, async (req, res) => {
    const room = req.params.name;
    console.log(room);
    const api_server = "https://api2.aleph.im";
    
    // Ensure valid integers for page and limit
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
  
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid page or limit values" });
    }
  
    try {
      // Fetch posts using Aleph API
      const response = await aleph.posts.get_posts('chat', {
        refs: [room], // Reference for room
        api_server: "https://api2.aleph.im"
      });
      if (response && response.posts) {
        return res.json(response.posts); // Return only the posts
      } else {
        return res.status(404).json({ error: "No posts found" });
      }
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      return res.status(500).json({ error: "Error fetching posts", details: err.message });
    }
  })

  .post("/message", verifyToken, async (req, res) => {
    if(req.user){
      try {
        const Auth_user = await User.findById(req.user.userId);
  
        if (!Auth_user || !Auth_user.private_key) {
          return res.status(400).send("User private key not found");
        }
        
        console.log('Message received:', {
          content: req.body.content,
          symmetricKey: Auth_user.symmetric_key
        });

        const account = await aleph.ethereum.import_account({ private_key: Auth_user.private_key });
        
        // Decrypt the message before storing
        let messageToStore;
        if (req.body.content.isEncrypted) {
          messageToStore = decryptMessage(req.body.content.body, Auth_user.symmetric_key);
          console.log('Decryption result:', {
            original: req.body.content.body,
            decrypted: messageToStore
          });
        } else {
          messageToStore = req.body.content.body;
        }

        // Store the decrypted message
        // const chat = await aleph.posts.submit(account.address, 'chat', { 
        //   body: messageToStore,
        //   isEncrypted: false
        // }, {
        //   ref: 'hall',
        //   api_server: process.env.api_server,
        //   account: account,
        //   channel: "TEST"
        // });

        res.status(200).json({
          status: "success",
          message: "Message stored successfully",
          decryptedMessage: messageToStore // Return for verification
        });
      } catch (err) {
        console.error("Error in /message route: ", err);
        res.status(500).send("Error processing message");
      }
    }
  })

  .post("/posts/:name", verifyToken, async (req, res) => {
    console.log("Request body: " + req.body.content.body);
    if(req.user){
        try {
          const Auth_user = await User.findById(req.user.userId);
      
          if (!Auth_user || !Auth_user.private_key) {
            return res.status(400).send("User private key not found");
          }
          
          const account = await aleph.ethereum.import_account({ private_key: Auth_user.private_key });
          console.log("Account symmetric key: " + Auth_user.symmetric_key);
          // The message is now received in an encrypted format
          // Encrypt the message content using the symmetric key
          const messageToEncrypt = req.body.content.body;
          const symmetricKey = Auth_user.symmetric_key;
          
          // Create a cipher using the symmetric key
          const cipher = crypto.createCipher('aes-256-cbc', symmetricKey);
          let encryptedMessage = cipher.update(messageToEncrypt, 'utf8', 'hex');
          encryptedMessage += cipher.final('hex');

          const encryptedContent = {
            body: encryptedMessage,
            isEncrypted: true
          };
          console.log("Encrypted content: " + encryptedContent);
          // const chat = await aleph.posts.submit(account.address, 'chat', { 
          //   body: encryptedContent
          // }, {
          //   ref: req.params.name,
          //   api_server: process.env.api_server,
          //   account: account,
          //   channel: "TEST"
          // });
          
          console.log("Blockchain chat log: " + chat);
          res.status(200).send("Encrypted message sent");
        } catch (err) {
          console.log("Error in /message route: ", err);
          res.status(500).send("Error sending message");
        }
    }
  })

async function verifyToken(req, res, next) {  
  // Extract the token from the 'Authorization' header
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Split by space, not '='  
  if (!token) return res.status(401).send("Access denied");
  try {
    // Verify the token using JWT
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user info to the request
    req.user = decodedPayload; // Attach the full decoded payload, not just the _id
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

app.listen(3000, () => console.log("Server Started..."));