const aleph = require('aleph-js')
const { randomBytes } = require('crypto')

class CrossPlatformBridge {
    constructor() {
        this.aleph = aleph
        this.nodeId = randomBytes(32).toString('hex')
    }

    async init() {
        this.account = await this.aleph.ethereum.new_account()
        console.log('Cross-platform bridge initialized')
    }

    async inviteUser(channelId, userEmail) {
        // Generate both types of access
        const inviteToken = randomBytes(16).toString('hex')
        const webAccessToken = randomBytes(32).toString('hex')

        // Store access information
        await this.aleph.posts.submit(
            this.account.address,
            'cross_platform_invite',
            {
                channelId,
                inviteToken,
                webAccessToken,
                userEmail,
                created: Date.now(),
                expiry: Date.now() + (7 * 24 * 60 * 60 * 1000),
                sender: this.nodeId
            },
            {
                ref: inviteToken,
                api_server: "https://api2.aleph.im",
                account: this.account
            }
        )

        return {
            appLink: `https://yourchatapp.com/join/${inviteToken}`,
            webLink: `https://yourchatapp.com/web-chat/${webAccessToken}`,
            emailTemplate: this.generateEmailTemplate(inviteToken, webAccessToken)
        }
    }

    generateEmailTemplate(inviteToken, webAccessToken) {
        return `
            Hi there!

            Someone has invited you to chat!

            You have two options to start chatting:

            1. Download our app: https://yourchatapp.com/join/${inviteToken}
            2. Chat via web browser: https://yourchatapp.com/web-chat/${webAccessToken}

            The web access link will expire in 7 days.

            Happy chatting!
        `
    }

    async verifyAccess(token) {
        try {
            const response = await this.aleph.posts.get_posts('cross_platform_invite', {
                refs: [token],
                api_server: "https://api2.aleph.im"
            })

            if (response.posts.length === 0) return null

            const invite = response.posts[0].content
            if (Date.now() > invite.expiry) return null

            return invite
        } catch (error) {
            console.error('Access verification failed:', error)
            return null
        }
    }
}

// Demo usage
async function demonstrateCrossPlatform() {
    console.log('🌐 Starting Cross-Platform Demo...\n')

    const bridge = new CrossPlatformBridge()
    await bridge.init()

    // User 1 invites User 2
    const channelId = 'demo-channel-' + Date.now()
    const inviteData = await bridge.inviteUser(channelId, 'user2@example.com')

    console.log('📨 Invitation Generated:')
    console.log('App Download Link:', inviteData.appLink)
    console.log('Web Access Link:', inviteData.webLink)
    console.log('\n📧 Email Template:')
    console.log(inviteData.emailTemplate)

    // Verify access
    const verification = await bridge.verifyAccess(inviteData.appLink.split('/').pop())
    console.log('\n✅ Access Verification:', verification ? 'Valid' : 'Invalid')
}

if (require.main === module) {
    demonstrateCrossPlatform().catch(console.error)
}

module.exports = CrossPlatformBridge 