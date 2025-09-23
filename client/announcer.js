







function initAnnouncer() {

	const announcer = document.getElementsByClassName("announcer")[0];
	const ws = new WebSocket(`ws://${location.host}/announcer-wscast`);

	ws.onmessage = event => {

		const message = JSON.parse(event.data);
		// console.log(message);
		announcer.innerText += message.message
	}
}







