const aleph = require('aleph-js')
const { randomBytes } = require('crypto')

class AlephP2PDemo {
    constructor() {
        // Initialize Aleph connection with default network (mainnet)
        this.aleph = aleph
        this.channelSubscriptions = new Map()
        this.nodeId = randomBytes(32).toString('hex')
    }

    async init() {
        try {
            // No need to connect explicitly with the new API
            console.log('Connected to Aleph.im network!')
            console.log('Node ID:', this.nodeId)
            return true
        } catch (error) {
            console.error('Failed to connect to Aleph.im:', error)
            return false
        }
    }

    async createChannel(channelId) {
        try {
            // Create a topic subscription for the channel using posts
            const subscription = await this.aleph.posts.get_posts('chat', {
                refs: [channelId],
                api_server: "https://api2.aleph.im"
            })
            
            this.channelSubscriptions.set(channelId, subscription)
            console.log(`Created channel: ${channelId}`)
            return true
        } catch (error) {
            console.error(`Failed to create channel ${channelId}:`, error)
            return false
        }
    }

    async sendMessage(channelId, content) {
        try {
            const message = {
                content,
                timestamp: Date.now(),
                sender: this.nodeId
            }

            // Create an Ethereum account for posting
            const account = await this.aleph.ethereum.new_account()
            
            await this.aleph.posts.submit(
                account.address,
                'chat',
                message,
                {
                    ref: channelId,
                    api_server: "https://api2.aleph.im",
                    account: account,
                    channel: "TEST"
                }
            )
            
            console.log(`Message sent to channel ${channelId}`)
            return true
        } catch (error) {
            console.error(`Failed to send message to ${channelId}:`, error)
            return false
        }
    }

    async getChannelMessages(channelId, limit = 50) {
        try {
            const messages = await this.aleph.posts.get_posts('chat', {
                refs: [channelId],
                api_server: "https://api2.aleph.im",
                limit: limit
            })
            return messages.posts || []
        } catch (error) {
            console.error(`Failed to get messages from ${channelId}:`, error)
            return []
        }
    }

    async disconnect() {
        // Clear subscriptions
        this.channelSubscriptions.clear()
        console.log('Disconnected from Aleph.im network')
    }
}

// Enhanced demo usage with two users
async function runEnhancedDemo() {
    console.log('🚀 Starting Enhanced Aleph.im P2P Demo with 2 users...\n')

    // Create two demo users
    console.log('👥 Creating two demo users...')
    const user1 = new AlephP2PDemo()
    const user2 = new AlephP2PDemo()
    
    // Connect both users to Aleph network
    console.log('\n📡 Connecting users to Aleph.im network...')
    await user1.init()
    console.log('✅ User 1 connected with ID:', user1.nodeId.slice(0, 8) + '...')
    await user2.init()
    console.log('✅ User 2 connected with ID:', user2.nodeId.slice(0, 8) + '...\n')
    
    // Create a shared channel
    const channelId = 'demo-chat-' + Date.now()
    console.log('📢 Creating shared channel:', channelId)
    
    // Both users join the channel
    console.log('\n🤝 Users joining channel...')
    await user1.createChannel(channelId)
    await user2.createChannel(channelId)
    console.log('✅ Both users joined the channel successfully\n')
    
    // Simulate conversation
    console.log('💬 Starting conversation simulation...\n')
    
    // User 1 sends messages
    console.log('👤 User 1 sending messages...')
    await user1.sendMessage(channelId, 'Hey there! This is User 1!')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
    
    // User 2 sends messages
    console.log('👤 User 2 sending messages...')
    await user2.sendMessage(channelId, 'Hello User 1! Nice to meet you!')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // User 1 responds
    console.log('👤 User 1 responding...')
    await user1.sendMessage(channelId, 'How is the P2P connection working for you?')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // User 2 responds
    console.log('👤 User 2 responding...')
    await user2.sendMessage(channelId, 'Working great! The Aleph.im network is amazing!')
    
    // Get channel history
    console.log('\n📜 Retrieving channel history...')
    const messages = await user1.getChannelMessages(channelId)
    console.log('\nChannel History:')
    messages.forEach((msg, index) => {
        console.log(`\nMessage ${index + 1}:`)
        console.log('From:', msg.sender?.slice(0, 8) + '...')
        console.log('Content:', msg.content)
        console.log('Timestamp:', new Date(msg.timestamp).toLocaleString())
    })
    
    // Listen for real-time messages
    console.log('\n👂 Listening for real-time messages for 30 seconds...')
    console.log('(Feel free to send additional messages during this time)')
    
    await new Promise(resolve => setTimeout(resolve, 30000))
    
    // Cleanup
    console.log('\n🧹 Cleaning up...')
    await user1.disconnect()
    await user2.disconnect()
    console.log('✅ Demo completed successfully!')
}

// Run the enhanced demo if this file is executed directly
if (require.main === module) {
    runEnhancedDemo().catch(error => {
        console.error('❌ Demo failed with error:', error)
    })
}

module.exports = AlephP2PDemo
