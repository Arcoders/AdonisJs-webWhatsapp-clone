/**
 * Importing pusher
 */
import Pusher from 'pusher-js'

/**
 * ExtendedPusher class
 *
 * @param {String} Pusher_key
 * @param {Object} options
 */
class ExtendedPusher {

    constructor(key, options) {
        this.pusher   = new Pusher(key, options)
        this.channels = []
        this.events = {}
    }

    /**
     * Subscribe to the given channel and give a fallback to bind events to the channel.
     *
     * @param  {String}   channel_name
     * @param  {Function} callback
     */
    subscribe(channel_name, callback) {
        let channel = this.pusher.subscribe(channel_name)
        if (!this.channels.includes(channel)) this.channels.push(channel_name)
        callback(channel)
    }

    /**
     * Unsubscribe from the given channel.
     *
     * @param  {String} channel
     */
    unsubscribe(channel) {
        this.pusher.unsubscribe(channel)
    }

    /**
     * Return all the chanels.
     *
     * @return {Array}
     */
    getChannels() {
        return this.channels
    }

    /**
     * Emit event with a custom name and a callback
     *
     * @param {String} name the event type to be created
     * @param {Function} data the handler to be share
     */
    $emit(name, data) {
		this.events[name] && this.events[name].head.run(data)
    }
        
    /**
     * Listen an event with a custom name and recive data from callback
     *
     * @param {String} name  the event type to be triggered
     * @param {Function} data the handler to be called when event occurs
     */
	$on(name, callback) {
		(this.events[name] || (this.events[name] = new List())).insert(callback)
	}

}

/**
 * Make any js object an event emitter
 *
 * @class Bond
 */
class Bond {

	constructor(prev, next, callback = () => {}) {
		this.prev = prev
		this.next = next
		this.callback = callback
    }
    
	run (data) {
		this.callback(data)
		this.next && this.next.run(data)
    }
    
}

/**
 * logic to add events to the list
 *
 * @class List
 */
class List {
	constructor() {
		this.head = new Bond()
		this.tail = new Bond(this.head)
	}
	insert(callback) {
		let link = new Bond(this.tail.prev, this.tail, callback)
		return link.next.prev = (link.prev.next = link)
	}
}

export default ExtendedPusher


