







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
			});	announcer.scrollIntoView(false);//window.scrollTo(0, document.body.scrollHeight)
		})
	})
	.catch(E => console.error(E));


	const ws = new WebSocket(`ws://${location.host}/announcer-wscast`)
	ws.addEventListener("open",event => heartbit(ws));
	ws.addEventListener("message",event => {

		messageBlock = document.createElement("pre");
		messageBlock.className = "announcer-message";
		messageBlock.innerText = event.data;

		(function fader(R, G, B, block) {

			++R; ++G; ++B;
			block.style.backgroundColor = `rgb(${R},${G},${B})`;
			if(R !== 255 && G !== 255 && B !== 255) setTimeout(() => fader(R, G, B, block),100);

		})(216, 216, 216, messageBlock);

		announcer.appendChild(messageBlock);
		announcer.scrollIntoView(false)
	})
}
function heartbit(socket, timeout) {

	/*
	 *	Makes websocket "socket" ping to server
	 *	to asure connection will be kept alive.
	 *	By default "timeout" timer is 3600000
	 *	(one hour).
	 */

	setTimeout(() => {

		socket.send("heartbit");
		heartbit(socket, timeout)

	},	timeout || 3600000)
}







