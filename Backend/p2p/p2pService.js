const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const { NOISE } = require('libp2p-noise')
const Bootstrap = require('libp2p-bootstrap')
const PubSubRoom = require('ipfs-pubsub-room')
const EventEmitter = require('events')

class P2PService extends EventEmitter {
    constructor(config) {
        super()
        this.config = config
        this.channels = new Map()
        this.peers = new Set()
    }

    async init() {
        // Create libp2p node
        this.node = await Libp2p.create({
            addresses: {
                listen: [`/ip4/0.0.0.0/tcp/${this.config.P2P_PORT}`]
            },
            modules: {
                transport: [TCP],
                streamMuxer: [Mplex],
                connEncryption: [NOISE],
                peerDiscovery: [Bootstrap]
            },
            config: {
                peerDiscovery: {
                    bootstrap: {
                        list: this.config.P2P_BOOTSTRAP_NODES
                    }
                }
            }
        })

        // Start the node
        await this.node.start()
        console.log('P2P node started!')

        // Setup peer discovery
        this.setupPeerDiscovery()
    }

    setupPeerDiscovery() {
        this.node.on('peer:discovery', (peer) => {
            console.log('Discovered peer:', peer.id.toB58String())
            this.peers.add(peer.id.toB58String())
            this.emit('peer:discovered', peer)
        })

        this.node.on('peer:connect', (peer) => {
            console.log('Connected to peer:', peer.id.toB58String())
            this.emit('peer:connected', peer)
        })
    }

    async createChannel(channelId) {
        if (this.channels.has(channelId)) {
            return this.channels.get(channelId)
        }

        const room = new PubSubRoom(this.node, channelId)
        this.channels.set(channelId, room)

        room.on('message', (message) => {
            this.emit('message', {
                channelId,
                message: message.data.toString(),
                from: message.from
            })
        })

        return room
    }

    async joinChannel(channelId) {
        const room = await this.createChannel(channelId)
        room.on('peer joined', (peer) => {
            console.log(`Peer ${peer} joined channel ${channelId}`)
        })
        room.on('peer left', (peer) => {
            console.log(`Peer ${peer} left channel ${channelId}`)
        })
        return room
    }

    async sendMessage(channelId, message) {
        const room = this.channels.get(channelId)
        if (!room) {
            throw new Error(`Channel ${channelId} not found`)
        }
        await room.broadcast(message)
    }

    async stop() {
        for (const room of this.channels.values()) {
            room.leave()
        }
        await this.node.stop()
    }
}

module.exports = P2PService 