import { createHelia } from 'helia';
import { strings } from '@helia/strings';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { bootstrap } from '@libp2p/bootstrap';
import { createLibp2p } from 'libp2p';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { peerIdFromString } from '@libp2p/peer-id';
import { CID } from 'multiformats/cid';
import CryptoJS from 'crypto-js';

class P2PMessaging {
  constructor() {
    this.helia = null;
    this.strings = null;
    this.libp2p = null;
    this.peerId = null;
    this.channelName = 'aleph-chat-channel';
    this.encryptionKey = null;
  }

  async initialize(encryptionKey) {
    try {
      this.encryptionKey = encryptionKey;
  
      // Initialize libp2p with updated configuration
      this.libp2p = await createLibp2p({
        addresses: {
          listen: [
            '/ip4/127.0.0.1/tcp/5001'
          ]
        },
        transports: [
          webSockets(),
          webRTC()
        ],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()],
        peerDiscovery: [
          bootstrap({
            list: [
              '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZgBMjTezGAJN',
              '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbXJJ16u19uLTa'
            ],
            timeout: 1000
          })
        ],
        pubsub: gossipsub({
          allowPublishToZeroPeers: true,
          emitSelf: true,
          gossipIncoming: true
        }),
        services: {
          identify: (args) => import('@libp2p/identify').then((mod) => mod.default(args)), // Dynamic import to resolve compatibility
        }
      });
  
      // Initialize Helia with the libp2p node
      this.helia = await createHelia({
        libp2p: this.libp2p
      });
  
      // Initialize the strings interface
      this.strings = strings(this.helia);
  
      await this.libp2p.start();
      this.peerId = this.libp2p.peerId;
  
      console.log('P2P Node initialized with ID:', this.peerId.toString());
  
      // Subscribe to channel
      await this.subscribeToChannel();
      return true;
    } catch (error) {
      console.error('Failed to initialize P2P node:', error);
      return false;
    }
  }
  
  async storeMessage(message) {
    try {
      const encodedMessage = new TextEncoder().encode(JSON.stringify(message));
      const cid = await this.strings.add(encodedMessage);
      return cid.toString();
    } catch (error) {
      console.error('Failed to store message:', error);
      return null;
    }
  }

  async retrieveMessage(cidString) {
    try {
      const cid = CID.parse(cidString);
      const encodedMessage = await this.strings.get(cid);
      return JSON.parse(new TextDecoder().decode(encodedMessage));
    } catch (error) {
      console.error('Failed to retrieve message:', error);
      return null;
    }
  }

  async subscribeToChannel() {
    try {
      await this.libp2p.pubsub.subscribe(this.channelName);
      
      this.libp2p.pubsub.addEventListener('message', (evt) => {
        if (evt.detail.topic === this.channelName) {
          const message = this.decryptMessage(evt.detail.data);
          if (message) {
            this.handleIncomingMessage(message);
          }
        }
      });

      console.log('Subscribed to channel:', this.channelName);
    } catch (error) {
      console.error('Failed to subscribe to channel:', error);
    }
  }

  encryptMessage(message) {
    try {
      const key = CryptoJS.SHA256(this.encryptionKey).toString();
      return CryptoJS.AES.encrypt(JSON.stringify(message), key).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  decryptMessage(encryptedData) {
    try {
      const key = CryptoJS.SHA256(this.encryptionKey).toString();
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  async disconnect() {
    try {
      await this.libp2p.pubsub.unsubscribe(this.channelName);
      await this.libp2p.stop();
      this.helia = null;
      this.strings = null;
      console.log('P2P node disconnected');
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }
}

export default P2PMessaging; 