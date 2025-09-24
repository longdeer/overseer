







function initAnnouncer() {

	const announcer = document.getElementsByClassName("announcer-view")[0];
	let   messageBlock;


	fetch("/announcer-setup")
	.then(response => {

		if(response.status !== 200) console.error(`setup fetch status: ${response.status}`);
		else response.json().then(data => {

			data.forEach(message => {

				messageBlock = document.createElement("pre");
				messageBlock.className = "announcer-message";
				messageBlock.innerText = message;
				announcer.appendChild(messageBlock)
			})
		})
	})
	.catch(E => console.error(E));


	new WebSocket(`ws://${location.host}/announcer-wscast`).onmessage = event => {

		messageBlock = document.createElement("pre");
		messageBlock.className = "announcer-message";
		messageBlock.innerText = event.data;
		announcer.appendChild(messageBlock)
	}
}







