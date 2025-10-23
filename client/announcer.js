import { heartbit } from "./tools.js";
import { fader } from "./tools.js";








window.initAnnouncer = function() {

	const announcer = document.getElementById("announcer-view");
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
			});	announcer.scrollTo(0, announcer.scrollHeight)
		})
	})
	.catch(E => console.error(E));


	const ws = new WebSocket(`ws://${location.host}/announcer-wscast`)
	ws.addEventListener("open",event => heartbit(ws));
	ws.addEventListener("message",event => {

		messageBlock = document.createElement("pre");
		messageBlock.className = "announcer-message";
		messageBlock.innerText = event.data;

		// TODO: enhance fader
		// fader(216, 216, 216, messageBlock);

		announcer.appendChild(messageBlock);
		announcer.scrollTo(0, announcer.scrollHeight)
	})
}







