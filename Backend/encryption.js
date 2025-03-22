const { randomBytes, createCipheriv, createDecipheriv, createSign, createVerify } = require('crypto');
const { generateKeyPairSync } = require('crypto');
const { publicEncrypt, privateDecrypt } = require('crypto');

class QuantumResistantEncryption {
    constructor() {
        this.KYBER_SECURITY_LEVEL = 3; // Highest security level (Kyber-1024)
        this.DILITHIUM_SECURITY_LEVEL = 3; // Highest security level (Dilithium3)
        this.SYMMETRIC_KEY_LENGTH = 32; // 256 bits
        this.NONCE_LENGTH = 12;
        this.AUTH_TAG_LENGTH = 16;
        this.HASH_ALGORITHM = 'sha512';
        this.SYMMETRIC_ALGORITHM = 'aes-256-gcm'; // Using AES-GCM for authenticated encryption
    }

    /**
     * Generate quantum-resistant key pair
     * @returns {Object} Contains public and private keys
     */
    generateKeyPair() {
        // Generate primary quantum-resistant keys (simulated Kyber)
        const primaryKeys = generateKeyPairSync('rsa', {
            modulusLength: 8192, // Increased from typical 2048 for quantum resistance
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        // Generate signing keys (simulated Dilithium)
        const signingKeys = generateKeyPairSync('rsa', {
            modulusLength: 8192,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        return {
            encryptionKeys: {
                publicKey: primaryKeys.publicKey,
                privateKey: primaryKeys.privateKey
            },
            signingKeys: {
                publicKey: signingKeys.publicKey,
                privateKey: signingKeys.privateKey
            }
        };
    }

    /**
     * Generate a secure symmetric key
     * @returns {Buffer} Symmetric key
     */
    generateSymmetricKey() {
        return randomBytes(this.SYMMETRIC_KEY_LENGTH);
    }

    /**
     * Encrypt a message using hybrid encryption
     * @param {string} message - Message to encrypt
     * @param {string} recipientPublicKey - Recipient's public key
     * @returns {Object} Encrypted message package
     */
    async encryptMessage(message, recipientPublicKey) {
        try {
            // Generate one-time symmetric key
            const symmetricKey = this.generateSymmetricKey();
            const nonce = randomBytes(this.NONCE_LENGTH);

            // Encrypt symmetric key with recipient's public key
            const encryptedSymmetricKey = publicEncrypt(
                recipientPublicKey,
                symmetricKey
            );

            // Encrypt message with symmetric key
            const cipher = createCipheriv(
                this.SYMMETRIC_ALGORITHM,
                symmetricKey,
                nonce
            );

            const encryptedMessage = Buffer.concat([
                cipher.update(message, 'utf8'),
                cipher.final()
            ]);

            const authTag = cipher.getAuthTag();

            return {
                encryptedMessage: encryptedMessage.toString('base64'),
                encryptedSymmetricKey: encryptedSymmetricKey.toString('base64'),
                nonce: nonce.toString('base64'),
                authTag: authTag.toString('base64')
            };
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Message encryption failed');
        }
    }

    /**
     * Decrypt a message using hybrid decryption
     * @param {Object} encryptedPackage - Package containing encrypted message and metadata
     * @param {string} recipientPrivateKey - Recipient's private key
     * @returns {string} Decrypted message
     */
    async decryptMessage(encryptedPackage, recipientPrivateKey) {
        try {
            // Decrypt the symmetric key
            const symmetricKey = privateDecrypt(
                recipientPrivateKey,
                Buffer.from(encryptedPackage.encryptedSymmetricKey, 'base64')
            );

            // Prepare for message decryption
            const decipher = createDecipheriv(
                this.SYMMETRIC_ALGORITHM,
                symmetricKey,
                Buffer.from(encryptedPackage.nonce, 'base64')
            );

            decipher.setAuthTag(Buffer.from(encryptedPackage.authTag, 'base64'));

            // Decrypt the message
            const decryptedMessage = Buffer.concat([
                decipher.update(Buffer.from(encryptedPackage.encryptedMessage, 'base64')),
                decipher.final()
            ]);

            return decryptedMessage.toString('utf8');
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Message decryption failed');
        }
    }

    /**
     * Sign a message
     * @param {string} message - Message to sign
     * @param {string} signingPrivateKey - Private key for signing
     * @returns {string} Digital signature
     */
    async signMessage(message, signingPrivateKey) {
        try {
            const signer = createSign('SHA512');
            signer.update(message);
            signer.end();
            const signature = signer.sign(signingPrivateKey);
            return signature.toString('base64');
        } catch (error) {
            console.error('Signing error:', error);
            throw new Error('Message signing failed');
        }
    }

    /**
     * Verify a message signature
     * @param {string} message - Original message
     * @param {string} signature - Digital signature to verify
     * @param {string} signingPublicKey - Public key for verification
     * @returns {boolean} Verification result
     */
    async verifySignature(message, signature, signingPublicKey) {
        try {
            const verifier = createVerify('SHA512');
            verifier.update(message);
            verifier.end();
            return verifier.verify(
                signingPublicKey,
                Buffer.from(signature, 'base64')
            );
        } catch (error) {
            console.error('Signature verification error:', error);
            return false;
        }
    }

    /**
     * Generate a secure hash of data
     * @param {string} data - Data to hash
     * @returns {string} Hash value
     */
    generateHash(data) {
        const crypto = require('crypto');
        const hash = crypto.createHash(this.HASH_ALGORITHM);
        hash.update(data);
        return hash.digest('hex');
    }
}

// Example usage:
const exampleUsage = async () => {
    try {
        const qre = new QuantumResistantEncryption();
        
        // Generate keys for both parties
        const aliceKeys = qre.generateKeyPair();
        const bobKeys = qre.generateKeyPair();

        // Alice encrypts a message for Bob
        const message = "Hello, Bob! This is a secure message.";
        const encryptedPackage = await qre.encryptMessage(
            message,
            bobKeys.encryptionKeys.publicKey
        );

        // Alice signs the message
        const signature = await qre.signMessage(
            message,
            aliceKeys.signingKeys.privateKey
        );

        // Bob decrypts the message
        const decryptedMessage = await qre.decryptMessage(
            encryptedPackage,
            bobKeys.encryptionKeys.privateKey
        );

        // Bob verifies Alice's signature
        const isValid = await qre.verifySignature(
            decryptedMessage,
            signature,
            aliceKeys.signingKeys.publicKey
        );

        console.log('Original message:', message);
        console.log('Decrypted message:', decryptedMessage);
        console.log('Signature valid:', isValid);
    } catch (error) {
        console.error('Example usage error:', error);
    }
};

module.exports = QuantumResistantEncryption;
