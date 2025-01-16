import P2PMessaging from './p2pMessaging';

async function testP2PMessaging() {
  console.group('🚀 Starting P2P Messaging Test');
  console.time('Total Test Duration');

  try {
    // 1. Initialize first peer (Alice)
    console.group('1️⃣ Initializing Peer Alice');
    console.time('Alice Init');
    const aliceNode = new P2PMessaging();
    const aliceKey = 'alice-secret-key-123';
    const aliceInitialized = await aliceNode.initialize(aliceKey);
    
    if (!aliceInitialized || !aliceNode.peerId) {
      throw new Error('Failed to initialize Alice node');
    }
    
    console.log('Alice Node ID:', aliceNode.peerId.toString());
    console.log('Alice Initialization Success:', aliceInitialized);
    console.timeEnd('Alice Init');
    console.groupEnd();

    // 2. Initialize second peer (Bob)
    console.group('2️⃣ Initializing Peer Bob');
    console.time('Bob Init');
    const bobNode = new P2PMessaging();
    const bobKey = 'alice-secret-key-123'; // Same key for test purposes
    const bobInitialized = await bobNode.initialize(bobKey);
    
    if (!bobInitialized || !bobNode.peerId) {
      throw new Error('Failed to initialize Bob node');
    }
    
    console.log('Bob Node ID:', bobNode.peerId.toString());
    console.log('Bob Initialization Success:', bobInitialized);
    console.timeEnd('Bob Init');
    console.groupEnd();

    // 3. Set up message listeners
    console.group('3️⃣ Setting up Message Listeners');
    
    window.addEventListener('p2p-message', (event) => {
      console.log('🔵 Alice received message:', {
        sender: event.detail.sender,
        content: event.detail.content,
        timestamp: new Date(event.detail.timestamp).toISOString()
      });
    });

    window.addEventListener('p2p-message', (event) => {
      console.log('🔴 Bob received message:', {
        sender: event.detail.sender,
        content: event.detail.content,
        timestamp: new Date(event.detail.timestamp).toISOString()
      });
    });
    
    console.log('Message listeners set up successfully');
    console.groupEnd();

    // 4. Wait for peer discovery
    console.group('4️⃣ Waiting for Peer Discovery');
    console.time('Peer Discovery');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Alice\'s connected peers:', await aliceNode.getConnectedPeers());
    console.log('Bob\'s connected peers:', await bobNode.getConnectedPeers());
    console.timeEnd('Peer Discovery');
    console.groupEnd();

    // 5. Test message sending
    console.group('5️⃣ Testing Message Exchange');
    
    // Alice sends a message
    console.group('Alice sending message');
    console.time('Alice Message Send');
    const aliceMessage = "Hello from Alice! 👋";
    const aliceSendResult = await aliceNode.sendMessage(aliceMessage);
    console.log('Message sent by Alice:', aliceMessage);
    console.log('Send result:', aliceSendResult);
    console.timeEnd('Alice Message Send');
    console.groupEnd();

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Bob sends a message
    console.group('Bob sending message');
    console.time('Bob Message Send');
    const bobMessage = "Hi Alice! Message received! 🎉";
    const bobSendResult = await bobNode.sendMessage(bobMessage);
    console.log('Message sent by Bob:', bobMessage);
    console.log('Send result:', bobSendResult);
    console.timeEnd('Bob Message Send');
    console.groupEnd();

    console.groupEnd();

    // 6. Test encryption
    console.group('6️⃣ Testing Encryption');
    const testMessage = { content: "Test encryption", sender: "test", timestamp: Date.now() };
    console.log('Original message:', testMessage);
    
    const encrypted = aliceNode.encryptMessage(testMessage);
    console.log('Encrypted message:', encrypted);
    
    const decrypted = bobNode.decryptMessage(encrypted);
    console.log('Decrypted message:', decrypted);
    
    console.log('Encryption test success:', JSON.stringify(testMessage) === JSON.stringify(decrypted));
    console.groupEnd();

    // 7. Clean up
    console.group('7️⃣ Cleaning Up');
    console.time('Cleanup');
    await aliceNode.disconnect();
    await bobNode.disconnect();
    console.log('Both nodes disconnected successfully');
    console.timeEnd('Cleanup');
    console.groupEnd();

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.timeEnd('Total Test Duration');
    console.groupEnd();
  }
}

// Prevent multiple simultaneous test runs
let isTestRunning = false;

// Export a wrapped version that prevents multiple simultaneous runs
export default async function runTest() {
  if (isTestRunning) {
    console.log('Test is already running...');
    return;
  }
  
  isTestRunning = true;
  try {
    await testP2PMessaging();
  } finally {
    isTestRunning = false;
  }
} 