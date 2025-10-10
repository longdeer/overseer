import { heartbit } from "./tools.js";
import { fader } from "./tools.js";








window.initAnnouncer = function() {

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

		fader(216, 216, 216, messageBlock);

		announcer.appendChild(messageBlock);
		announcer.scrollIntoView(false)
	})
}







