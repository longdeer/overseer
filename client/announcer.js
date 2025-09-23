







function initAnnouncer() {

	const announcer = document.getElementsByClassName("announcer-view")[0];
	const ws = new WebSocket(`ws://${location.host}/announcer-wscast`);
	ws.onmessage = event => {

		const messageBlock = document.createElement("pre");
		messageBlock.className = "announcer-message";
		messageBlock.innerText = event.data;
		announcer.appendChild(messageBlock)
	}
}







