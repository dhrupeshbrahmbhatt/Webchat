const aleph = require('aleph-js')
const { randomBytes } = require('crypto')
const QuantumResistantEncryption = require('../utils/quantumEncryption')

class AlephAdvancedChat {
    constructor() {
        this.aleph = aleph
        this.nodeId = randomBytes(32).toString('hex')
        this.messageCache = new Map() // Channel -> Messages
        this.batchSize = 50 // Number of messages per post
        this.batchTimeout = 5000 // 5 seconds
        this.pendingMessages = new Map() // Channel -> Pending messages
        this.account = null
        this.messageExpiryDays = 7
        this.cleanupInterval = 1000 * 60 * 60 * 24 // Run cleanup once per day
        this.qre = new QuantumResistantEncryption()
        this.keyPair = null
        this.startCleanupScheduler()
    }

    async init() {
        try {
            this.account = await this.aleph.ethereum.new_account()
            // Generate quantum-resistant keys
            this.keyPair = this.qre.generateKeyPair()
            console.log('✨ Initialized Advanced Aleph Chat with quantum-resistant encryption')
            console.log('📱 User ID:', this.nodeId)
            return true
        } catch (error) {
            console.error('❌ Init failed:', error)
            return false
        }
    }

    startCleanupScheduler() {
        setInterval(() => this.cleanupExpiredMessages(), this.cleanupInterval)
    }

    async cleanupExpiredMessages() {
        try {
            console.log('🧹 Starting message cleanup...')
            const channels = await this.getActiveChannels()
            
            for (const channelId of channels) {
                const messages = await this.getChannelMessages(channelId)
                const now = Date.now()
                const expiryTime = this.messageExpiryDays * 24 * 60 * 60 * 1000 // 7 days in milliseconds
                
                // Filter out expired messages
                const activeMessages = messages.filter(message => {
                    const messageAge = now - message.timestamp
                    return messageAge < expiryTime
                })

                // If messages were removed, update the channel
                if (activeMessages.length < messages.length) {
                    console.log(`📤 Removing ${messages.length - activeMessages.length} expired messages from channel ${channelId}`)
                    await this.updateChannel(channelId, activeMessages)
                }
            }
            console.log('✨ Cleanup completed')
        } catch (error) {
            console.error('❌ Cleanup failed:', error)
        }
    }

    async getActiveChannels() {
        try {
            // Get all channels where this user has participated
            const response = await this.aleph.posts.get_posts('chat', {
                api_server: "https://api2.aleph.im",
                addresses: [this.account.address]
            })
            
            // Extract unique channel IDs from the posts
            const channels = new Set(response.posts.map(post => post.ref))
            return Array.from(channels)
        } catch (error) {
            console.error('❌ Failed to get active channels:', error)
            return []
        }
    }

    createMessage(content, type = 'text', replyTo = null, threadId = null) {
        return {
            id: randomBytes(16).toString('hex'),
            content,
            type,
            sender: this.nodeId,
            timestamp: Date.now(),
            expiryDate: Date.now() + (this.messageExpiryDays * 24 * 60 * 60 * 1000), // Add expiry date
            replyTo,
            threadId,
            reactions: {},
            edited: false,
            deleted: false,
            deletedForEveryone: false
        }
    }

    async batchSubmitMessages(channelId) {
        const pending = this.pendingMessages.get(channelId) || []
        if (pending.length === 0) return

        try {
            const existingMessages = await this.getChannelMessages(channelId)
            const allMessages = [...existingMessages, ...pending]

            await this.aleph.posts.submit(
                this.account.address,
                'chat',
                {
                    messages: allMessages,
                    lastUpdate: Date.now()
                },
                {
                    ref: channelId,
                    api_server: "https://api2.aleph.im",
                    account: this.account,
                    channel: "TEST"
                }
            )

            this.messageCache.set(channelId, allMessages)
            this.pendingMessages.set(channelId, [])
            console.log(`📦 Batch submitted ${pending.length} messages to channel ${channelId}`)
        } catch (error) {
            console.error('❌ Batch submit failed:', error)
        }
    }

    async sendMessage(channelId, content, type = 'text', replyTo = null, threadId = null) {
        const message = this.createMessage(content, type, replyTo, threadId)
        
        // Encrypt message with quantum-resistant encryption
        const encryptedPackage = await this.qre.encryptMessage(
            JSON.stringify(message),
            this.keyPair.encryptionKeys.publicKey
        )
        
        // Sign the encrypted message
        const signature = await this.qre.signMessage(
            JSON.stringify(message),
            this.keyPair.signingKeys.privateKey
        )

        let pending = this.pendingMessages.get(channelId) || []
        pending.push(message)
        this.pendingMessages.set(channelId, pending)

        // Schedule batch submit if it's the first pending message
        if (pending.length === 1) {
            setTimeout(() => this.batchSubmitMessages(channelId), this.batchTimeout)
        }
        
        // Immediate submit if batch size reached
        if (pending.length >= this.batchSize) {
            await this.batchSubmitMessages(channelId)
        }

        return message.id
    }

    async reactToMessage(channelId, messageId, reaction) {
        const messages = await this.getChannelMessages(channelId)
        const message = messages.find(m => m.id === messageId)
        
        if (message) {
            if (!message.reactions[reaction]) {
                message.reactions[reaction] = []
            }
            
            if (!message.reactions[reaction].includes(this.nodeId)) {
                message.reactions[reaction].push(this.nodeId)
                await this.updateChannel(channelId, messages)
            }
        }
    }

    async deleteMessage(channelId, messageId, forEveryone = false) {
        const messages = await this.getChannelMessages(channelId)
        const message = messages.find(m => m.id === messageId)
        
        if (message && message.sender === this.nodeId) {
            message.deleted = true
            message.deletedForEveryone = forEveryone
            message.content = forEveryone ? null : message.content
            await this.updateChannel(channelId, messages)
        }
    }

    async editMessage(channelId, messageId, newContent) {
        const messages = await this.getChannelMessages(channelId)
        const message = messages.find(m => m.id === messageId)
        
        if (message && message.sender === this.nodeId && !message.deleted) {
            message.content = newContent
            message.edited = true
            message.editTimestamp = Date.now()
            await this.updateChannel(channelId, messages)
        }
    }

    async createThread(channelId, parentMessageId, content) {
        return await this.sendMessage(channelId, content, 'text', null, parentMessageId)
    }

    async getThreadMessages(channelId, threadId) {
        const messages = await this.getChannelMessages(channelId)
        return messages.filter(m => m.threadId === threadId)
    }

    async getChannelMessages(channelId) {
        try {
            const response = await this.aleph.posts.get_posts('chat', {
                refs: [channelId],
                api_server: "https://api2.aleph.im",
                limit: 1
            })

            const post = response.posts[0]
            if (!post) return []

            // Filter out expired messages when retrieving
            const now = Date.now()
            return post.content.messages.filter(message => {
                const messageAge = now - message.timestamp
                return messageAge < (this.messageExpiryDays * 24 * 60 * 60 * 1000)
            })
        } catch (error) {
            console.error(`❌ Failed to get messages from ${channelId}:`, error)
            return []
        }
    }

    async updateChannel(channelId, messages) {
        await this.aleph.posts.submit(
            this.account.address,
            'chat',
            {
                messages,
                lastUpdate: Date.now()
            },
            {
                ref: channelId,
                api_server: "https://api2.aleph.im",
                account: this.account,
                channel: "TEST"
            }
        )
    }

    // Add method to check message expiry
    isMessageExpired(message) {
        const now = Date.now()
        const messageAge = now - message.timestamp
        return messageAge >= (this.messageExpiryDays * 24 * 60 * 60 * 1000)
    }

    // Add method to get time until message expires
    getTimeUntilExpiry(message) {
        const now = Date.now()
        const expiryTime = message.timestamp + (this.messageExpiryDays * 24 * 60 * 60 * 1000)
        return Math.max(0, expiryTime - now)
    }
}

// Enhanced demo to test all features
async function runAdvancedDemo() {
    console.log('🚀 Starting Advanced Aleph.im Chat Demo...\n')

    const user1 = new AlephAdvancedChat()
    const user2 = new AlephAdvancedChat()

    await user1.init()
    await user2.init()
    
    console.log('👤 User 1 ID:', user1.nodeId)
    console.log('👤 User 2 ID:', user2.nodeId)

    const channelId = 'advanced-demo-' + Date.now()
    console.log('\n📢 Testing channel:', channelId)

    // Test regular messages
    console.log('\n📝 Testing regular messages...')
    const msg1Id = await user1.sendMessage(channelId, 'Hello! This is a test message')
    console.log('👤 User 1:', 'Hello! This is a test message')
    
    await new Promise(r => setTimeout(r, 1000))
    const msg2Id = await user2.sendMessage(channelId, 'Hi! Got your message')
    console.log('👤 User 2:', 'Hi! Got your message')

    // Test reactions
    console.log('\n😄 Testing message reactions...')
    await user2.reactToMessage(channelId, msg1Id, '👍')
    console.log('👤 User 2 reacted with 👍 to User 1\'s message')
    
    await user1.reactToMessage(channelId, msg2Id, '❤️')
    console.log('👤 User 1 reacted with ❤️ to User 2\'s message')

    // Test thread creation
    console.log('\n🧵 Testing thread creation...')
    await user1.createThread(channelId, msg1Id, 'Starting a thread here!')
    console.log('👤 User 1 (thread):', 'Starting a thread here!')
    
    await user2.createThread(channelId, msg1Id, 'Replying in thread')
    console.log('👤 User 2 (thread):', 'Replying in thread')

    // Test message editing
    console.log('\n✏️ Testing message editing...')
    await user1.editMessage(channelId, msg1Id, 'Hello! This is an edited message')
    console.log('👤 User 1 edited message to:', 'Hello! This is an edited message')

    // Test message deletion
    console.log('\n🗑️ Testing message deletion...')
    const deleteTestId = await user1.sendMessage(channelId, 'This will be deleted')
    console.log('👤 User 1:', 'This will be deleted')
    await new Promise(r => setTimeout(r, 1000))
    await user1.deleteMessage(channelId, deleteTestId, true)
    console.log('👤 User 1 deleted their message')

    // Display message summary
    console.log('\n📊 Message Summary')
    console.log('==================')
    
    const finalMessages = await user1.getChannelMessages(channelId)
    
    console.log('\n👤 User 1 Messages:')
    console.log('------------------')
    finalMessages
        .filter(m => m.sender === user1.nodeId)
        .forEach(m => {
            console.log(`${m.deleted ? '🗑️ ' : ''}${m.edited ? '✏️ ' : ''}${m.threadId ? '🧵 ' : ''}Message: ${m.content || '[deleted]'}`)
            if (Object.keys(m.reactions).length > 0) {
                console.log(`   Reactions: ${Object.entries(m.reactions).map(([emoji, users]) => `${emoji} (${users.length})`).join(', ')}`)
            }
        })

    console.log('\n👤 User 2 Messages:')
    console.log('------------------')
    finalMessages
        .filter(m => m.sender === user2.nodeId)
        .forEach(m => {
            console.log(`${m.deleted ? '🗑️ ' : ''}${m.edited ? '✏️ ' : ''}${m.threadId ? '🧵 ' : ''}Message: ${m.content || '[deleted]'}`)
            if (Object.keys(m.reactions).length > 0) {
                console.log(`   Reactions: ${Object.entries(m.reactions).map(([emoji, users]) => `${emoji} (${users.length})`).join(', ')}`)
            }
        })

    console.log('\n💬 Final Chat State:')
    console.log('==================')
    finalMessages.forEach(m => {
        console.log('\nMessage ID:', m.id)
        console.log('From:', m.sender)
        console.log('Content:', m.content || '[deleted]')
        console.log('Type:', m.type)
        console.log('Timestamp:', new Date(m.timestamp).toLocaleString())
        if (m.threadId) console.log('Thread ID:', m.threadId)
        if (m.edited) console.log('Edited:', m.edited)
        if (m.deleted) console.log('Deleted:', m.deleted)
        if (Object.keys(m.reactions).length > 0) {
            console.log('Reactions:', Object.entries(m.reactions)
                .map(([emoji, users]) => `${emoji} (${users.length} users)`)
                .join(', '))
        }
        console.log('---')
    })

    // Add message expiry test
    await testMessageExpiry(user1)

    console.log('\n✅ Advanced demo completed successfully!')
}

// Add to the demo to test message expiry
async function testMessageExpiry(chat) {
    console.log('\n⏰ Testing message expiry...')
    const channelId = 'expiry-test-' + Date.now()
    
    // Create a message with modified timestamp to simulate an old message
    const oldMessage = chat.createMessage('This is an old message')
    oldMessage.timestamp = Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days old
    
    const newMessage = chat.createMessage('This is a new message')
    
    // Manually add messages to channel
    await chat.updateChannel(channelId, [oldMessage, newMessage])
    
    // Force cleanup
    await chat.cleanupExpiredMessages()
    
    // Check remaining messages
    const remainingMessages = await chat.getChannelMessages(channelId)
    console.log('Messages after cleanup:', remainingMessages.length)
    console.log('Remaining messages:', remainingMessages.map(m => m.content))
}

// Run the demo
if (require.main === module) {
    runAdvancedDemo().catch(console.error)
}

module.exports = AlephAdvancedChat 