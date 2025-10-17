import { heartbit } from "./tools.js";








window.initChat = function() {

	const chat = document.getElementsByClassName("chat")[0];
	const chatView = document.getElementsByClassName("chat-view")[0];
	const userMessage = document.forms[0].elements[0];
	const sender = document.forms[0].elements[1];
	const ws = new WebSocket(`ws://${location.host}/chat-wscast`);

	ws.addEventListener("open",event => heartbit(ws));
	ws.addEventListener("message",event => {

		const { user,userMessage } = JSON.parse(event.data);
		const item = document.createElement("p");
		item.innerText = `${user}: ${userMessage}`;
		chatView.appendChild(item)
	});
	sender.addEventListener("click",event => {

		event.preventDefault();
		ws.send(userMessage.value)
	})
}







