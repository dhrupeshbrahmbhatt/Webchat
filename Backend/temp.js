const QuantumResistantEncryption = require('./encryption');

async function demonstrateEncryption() {
    console.log('🚀 Starting Quantum-Resistant Encryption Demo\n');

    try {
        // Step 1: Initialize encryption system
        console.log('📑 Initializing Quantum-Resistant Encryption System...');
        const qre = new QuantumResistantEncryption();
        console.log('✅ Encryption system initialized\n');

        // Step 2: Generate key pairs for Alice and Bob
        console.log('🔑 Generating key pairs for Alice and Bob...');
        const aliceKeys = qre.generateKeyPair();
        const bobKeys = qre.generateKeyPair();
        console.log('✅ Key pairs generated\n');

        // Step 3: Alice sends an encrypted message to Bob
        console.log('📝 Alice preparing message for Bob...');
        const originalMessage = "Hello Bob! This is a secret message that needs quantum-resistant protection.";
        console.log('📤 Original message:', originalMessage);
        
        console.log('\n🔒 Alice encrypting message with Bob\'s public key...');
        const encryptedPackage = await qre.encryptMessage(
            originalMessage,
            bobKeys.encryptionKeys.publicKey
        );
        
        console.log('📦 Encrypted Package Details:');
        console.log('   - Encrypted Message:', 
            encryptedPackage.encryptedMessage);
        console.log('   - Encrypted Symmetric Key:', 
            encryptedPackage.encryptedSymmetricKey);
        console.log('   - Nonce:', encryptedPackage.nonce);
        console.log('   - Auth Tag:', encryptedPackage.authTag);

        // Step 4: Alice signs the message
        console.log('\n✍️  Alice signing the message...');
        const signature = await qre.signMessage(
            originalMessage,
            aliceKeys.signingKeys.privateKey
        );
        console.log('✅ Message signed');

        // Step 5: Bob decrypts the message
        console.log('\n🔓 Bob decrypting the message...');
        const decryptedMessage = await qre.decryptMessage(
            encryptedPackage,
            bobKeys.encryptionKeys.privateKey
        );
        console.log('📨 Decrypted message:', decryptedMessage);

        // Step 6: Bob verifies Alice's signature
        console.log('\n🔍 Bob verifying Alice\'s signature...');
        const isValid = await qre.verifySignature(
            decryptedMessage,
            signature,
            aliceKeys.signingKeys.publicKey
        );
        console.log('✅ Signature verification:', isValid ? 'Valid' : 'Invalid');

        // Step 7: Verification of message integrity
        console.log('\n🔎 Message Integrity Check:');
        console.log('Original message matches decrypted message:', 
            originalMessage === decryptedMessage ? '✅ Yes' : '❌ No');

        // Step 8: Demonstrate failed verification (optional)
        console.log('\n🧪 Testing signature verification with tampered message...');
        const tamperedMessage = decryptedMessage + " (tampered)";
        const tamperedValid = await qre.verifySignature(
            tamperedMessage,
            signature,
            aliceKeys.signingKeys.publicKey
        );
        console.log('Tampered message signature verification:', 
            tamperedValid ? '❌ Incorrectly Valid' : '✅ Correctly Invalid');

    } catch (error) {
        console.error('\n❌ Demo failed:', error.message);
        console.error('Error details:', error);
    }
}

// Run the demo with proper formatting
console.log('='.repeat(80));
console.log('🔬 Quantum-Resistant Encryption System Demonstration');
console.log('='.repeat(80), '\n');

demonstrateEncryption().then(() => {
    console.log('\n' + '='.repeat(80));
    console.log('🎉 Demo completed successfully!');
    console.log('='.repeat(80));
}).catch(error => {
    console.log('\n' + '='.repeat(80));
    console.log('❌ Demo failed with error:', error.message);
    console.log('='.repeat(80));
}); 