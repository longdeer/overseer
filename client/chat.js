import { heartbit } from "./tools.js";








window.initChat = function() {

	const chat = document.getElementById("chat");
	const chatView = document.getElementById("chat-view");
	const userForm = document.getElementById("user-form");
	const userMessage = document.forms[0].elements[0];
	const sender = document.forms[0].elements[1];
	const ws = new WebSocket(`ws://${location.host}/chat-wscast`);

	ws.addEventListener("open",event => heartbit(ws));
	ws.addEventListener("message",event => {

		const item = document.createElement("p");
		item.innerText = event.data;
		chatView.appendChild(item)
	});
	sender.addEventListener("click",event => {

		event.preventDefault();
		ws.send(userMessage.value);
		userForm.reset()
	})
}







