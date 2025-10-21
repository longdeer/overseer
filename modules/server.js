const ws = require("faye-websocket");
const fsextra = require("fs-extra");
const crypto = require("crypto");








class Overseer {
	constructor(options, loggy) {


		this.loggy = loggy;
		this.chatClients = {};
		this.chatHistory = [];
		this.announcerClients = {};
		this.announcerHistory = [];
		this.reader = options.reader;
		this.pollTimer = options.snmp.pollTimer;
		this.snmpPoller = options.snmp.poller;
		this.monitorSetup = {

			timer: options.snmp.pollTimer,
			targets: options.snmp.targets,
			parameters: options.snmp.parameters,
			descriptions: options.snmp.descriptions
		};
		this.announcerView = fsextra.readFileSync("./client/announcer.html");
		this.readerView = fsextra.readFileSync("./client/reader.html");
		this.indexPage = fsextra.readFileSync("./client/index.html");
		this.fileView = fsextra.readFileSync("./client/file.html");
		this.chatView = fsextra.readFileSync("./client/chat.html");
		this.upsView = fsextra.readFileSync("./client/ups.html");
		this.readerFileLink = /\/reader-file-([\-a-fA-F0-9]+)+/;
		this.server = new require("http").Server();


		this.server.on("request",async (message,response) => {


			const requestedURL = message.url;
			const requestedMethod = message.method;
			const remoteAddress = message.socket.remoteAddress;
			this.loggy.info(`${remoteAddress} ${requestedMethod} ${requestedURL}`);


			switch(requestedMethod) {


				case "GET":
					switch(requestedURL) {


						case "/client/ups.js":

							response.writeHead(200,{ "Content-Type": "text/javascript" });
							response.write(fsextra.readFileSync("./client/ups.js"));
							break;


						case "/client/reader.js":

							response.writeHead(200,{ "Content-Type": "text/javascript" });
							response.write(fsextra.readFileSync("./client/reader.js"));
							break;


						case "/client/announcer.js":

							response.writeHead(200,{ "Content-Type": "text/javascript" });
							response.write(fsextra.readFileSync("./client/announcer.js"));
							break;


						case "/client/chat.js":

							response.writeHead(200,{ "Content-Type": "text/javascript" });
							response.write(fsextra.readFileSync("./client/chat.js"));
							break;


						case "/client/tools.js":

							response.writeHead(200,{ "Content-Type": "text/javascript" });
							response.write(fsextra.readFileSync("./client/tools.js"));
							break;


						case "/client/styles.css":

							response.writeHead(200,{ "Content-Type": "text/css" });
							response.write(fsextra.readFileSync("./client/styles.css"));
							break;


						case "/":

							response.writeHead(200,{ "Content-Type": "text/html" });
							response.write(this.indexPage);
							break;


						case "/ups-monitor":

							response.writeHead(200,{ "Content-Type": "text/html" });
							response.write(this.upsView);
							break;


						case "/reader":

							response.writeHead(200,{ "Content-Type": "text/html" });
							response.write(this.readerView);
							break;


						case "/announcer":

							response.writeHead(200,{ "Content-Type": "text/html" });
							response.write(this.announcerView);
							break;


						case "/chat":

							response.writeHead(200,{ "Content-Type": "text/html" });
							response.write(this.chatView);
							break;


						case "/ups-monitor-setup":

							response.writeHead(200,{ "Content-Type": "application/json" });
							response.write(JSON.stringify(this.monitorSetup));
							break;


						case "/announcer-setup":

							response.writeHead(200,{ "Content-Type": "application/json" });
							response.write(JSON.stringify(this.announcerHistory));
							break;


						default:

							if(this.readerFileLink.test(requestedURL)) {

								try {

									const path = this.reader.decodePath(requestedURL.slice(13));
									const data = await this.reader.fileContent(path);
									response.writeHead(200,{ "Content-Type": "text/html" });
									response.write(`${this.fileView}`.replace("$content",data))

								}	catch(E) {

									response.writeHead(500,{ "Content-Type": "text/html" });
									response.write(`${this.fileView}`.replace("$",E))
								}
							}	else {

								this.loggy.warn(`${requestedURL} not found`);
								response.writeHead(404);

							}	break;


					};	break;


				case "POST":
					switch(requestedURL) {


						case "/announcer-receiver":

							let data;
							let announce;
							let raw = "";

							message.on("data",chunk => raw += chunk);
							message.on("end",() => {

								data = JSON.parse(raw);
								if(data && typeof(data) === "object" && typeof(data.message) === "string") {

									announce = data.message;
									this.loggy.info(`Received ${announce.length} symbols from ${remoteAddress}`);

									announce = `---- ${new Date()}\n\n${announce}`;
									this.announcerHistory.push(announce);
									if(100 <this.announcerHistory.length) this.announcerHistory.shift();

									Object.values(this.announcerClients).forEach(connection => connection.send(announce))
								}
							});	break;


						default:

							this.loggy.warn(`${requestedURL} not found`);
							response.writeHead(404);
							break;


					};	break;


				default:

					this.loggy.warn(`${requestedMethod} not supported`);
					response.writeHead(405);
					break;


			};	response.end()
		});


		this.server.on("upgrade",(req,sock,head) => {


			const requestedURL = req.url;
			const remoteAddress = sock.remoteAddress;
			const uuid = crypto.randomUUID();
			this.loggy.info(`${remoteAddress} UPGRADE ${requestedURL} (${uuid})`);


			if(ws.isWebSocket(req)) {
				let webSocket;


				switch(req.url) {
					case "/ups-monitor-wscast":

						let alive = true;
						webSocket = new ws(req,sock,head);

						webSocket.on("close",event => {

							this.loggy.info(`Closed ups-monitor websocket for ${remoteAddress} (${uuid})`);
							alive = false
						});
						webSocket.on("open",event => {

							this.loggy.info(`Opened ups-monitor websocket for ${remoteAddress} (${uuid})`);
							(function broadcast(poller, timer) {

								if(alive) {

									webSocket.send(JSON.stringify(poller.pollBuffer));
									setTimeout(broadcast, timer, poller, timer)

							}})(this.snmpPoller, this.pollTimer)
						});	break;


					case "/announcer-wscast":

						webSocket = new ws(req,sock,head);
						webSocket.on("close",() => {

							this.loggy.info(`Closed announcer websocket for ${remoteAddress} (${uuid})`);
							delete this.announcerClients[uuid]
						});
						webSocket.on("open",() => {

							this.loggy.info(`Opened announcer websocket for ${remoteAddress} (${uuid})`);
							this.announcerClients[uuid] = webSocket

						});
						webSocket.on("message",event => {

							if(event.data === "heartbit") this.loggy.info(`heartbit from ${remoteAddress} (${uuid})`);
							else this.loggy.warn(`Unexpected message from ${remoteAddress} (${uuid}): ${event.data}`)
						})
						break;


					case "/chat-wscast":

						webSocket = new ws(req,sock,head);
						webSocket.on("close",() => {

							this.loggy.info(`Closed chat websocket for ${remoteAddress} (${uuid})`);
							delete this.chatClients[uuid]
						});
						webSocket.on("open",() => {

							this.loggy.info(`Opened chat websocket for ${remoteAddress} (${uuid})`);
							this.chatHistory.forEach(message => webSocket.send(message));
							this.chatClients[uuid] = webSocket
						});
						webSocket.on("message",event => {

							if(event.data === "heartbit") this.loggy.info(`heartbit from ${remoteAddress} (${uuid})`);
							else {

								const userMessage = event.data;
								const messageRepr = `${new Date().toLocaleString()} from ${remoteAddress}: ${userMessage}`;

								this.chatHistory.push(messageRepr);
								this.loggy.info(`Broadcasting ${userMessage.length} symbols from ${remoteAddress} (${uuid})`);

								Object.values(this.chatClients).forEach(connection => connection.send(messageRepr))
							}
						})
						break;


					case "/reader-wscast":

						webSocket = new ws(req,sock,head);
						webSocket.on("close",() => this.loggy.info(`Closed reader websocket for ${remoteAddress} (${uuid})`));
						webSocket.on("open",() => {

							this.loggy.info(`Opened reader websocket for ${remoteAddress} (${uuid})`);
							this.loggy.info(`Reporting ${this.reader.roots.length} root folders`);
							webSocket.send(JSON.stringify({ roots: this.reader.roots }))

						});
						webSocket.on("message",async event => {

							if(event.data === "heartbit") this.loggy.info(`heartbit from ${remoteAddress} (${uuid})`);
							else try {

								const { parent,indent } = JSON.parse(event.data);
								this.loggy.info(`websocket request of ${parent} from ${remoteAddress} (${uuid})`);
								const children = await this.reader.getDir(parent);
								webSocket.send(JSON.stringify({ parent, children, indent }))

							}	catch(E) { this.loggy.warn(E) }

						});	break;


					case "/reader-file-wscast":

						webSocket = new ws(req,sock,head);
						webSocket.on("close",() => this.loggy.info(`Closed reader-file websocket for ${remoteAddress} (${uuid})`));
						webSocket.on("open",() => this.loggy.info(`Opened reader-file websocket for ${remoteAddress} (${uuid})`));
						webSocket.on("message",event => {

							if(event.data === "heartbit") this.loggy.info(`heartbit from ${remoteAddress} (${uuid})`);
							else {

								const path = this.reader.decodePath(event.data);
								this.loggy.info(`websocket watch request for ${path} from ${remoteAddress} (${uuid})`);
								this.reader.fileWatch(path,line => webSocket.send(`${line}\n`))
							}
						});	break;


					default:

						this.loggy.warn(`${requestedURL} not found`);
						response.writeHead(404);
						break;
				}
			}
		})
	}
}








module.exports = Overseer;







