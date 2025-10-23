import { heartbit } from "./tools.js";








window.initChat = function() {

	const chatView = document.getElementById("chat-view");
	const userForm = document.getElementById("user-form").querySelector("form");
	const ws = new WebSocket(`ws://${location.host}/chat-wscast`);

	ws.addEventListener("open",event => heartbit(ws));
	ws.addEventListener("message",event => {

		const barAtBottom = chatView.scrollHeight -1 <= chatView.scrollTop + chatView.clientHeight;
		const item = document.createElement("p");

		item.className = "chat-message";
		item.innerText = event.data;

		chatView.appendChild(item);
		if(barAtBottom) chatView.scrollTo(0, chatView.scrollHeight)
	});
	userForm.onsubmit = event => {

		event.preventDefault();
		ws.send(event.target[0].value);
		event.target.reset()
	}
}







