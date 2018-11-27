class Bond {
	constructor(prev, next, callback = () => {}) {
		this.prev = prev;
		this.next = next;
		this.callback = callback;
	}
	run (data) {
		this.callback(data);
		this.next && this.next.run(data);
	}
}
class List {
	constructor() {
		this.head = new Bond();
		this.tail = new Bond(this.head);
	}
	insert(callback) {
		let link = new Bond(this.tail.prev, this.tail, callback);
		return link.next.prev = (link.prev.next = link);
	}
}
class EventBus {
	constructor() {
		this.events = {};
	}
	$emit(name, data) {
		this.events[name] && this.events[name].head.run(data);
	}	
	$on(name, callback) {
		(this.events[name] || (this.events[name] = new List())).insert(callback);
	}
}

export default new EventBus()