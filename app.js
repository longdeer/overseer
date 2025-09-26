require("dotenv").config({ quiet: true });
const community = process.env.SNMP_COMMUNITY || "";
const names = JSON.parse(process.env.UPS_NAMES || "[]");
const targets = JSON.parse(process.env.UPS_ADDRESSES || "[]");
const pollNames = JSON.parse(process.env.UPS_SNMP_POLL_NAMES || "[]");
const parameters = JSON.parse(process.env.UPS_SNMP_POLL_PARAMETERS || "[]");
const snmpPollTimer = process.env.UPS_SNMP_POLL_TIMER;
const hostAddress = process.env.LISTEN_ADDRESS;
const hostPort = process.env.LISTEN_PORT;
const appName = process.env.APP_NAME;




const loggy = require("./modules/loggy.js").getRotatedLoggy(process.env.LOGGY_FOLDER, appName);
const XPPC = require("./modules/snmp.js").XPPC;
const ws = require("faye-websocket");
const fsextra = require("fs-extra");
const crypto = require("crypto");
const fspath = require("path");




const announcerView = fsextra.readFileSync("./client/announcer.html");
const announcerJS = fsextra.readFileSync("./client/announcer.js");
const styles = fsextra.readFileSync("./client/styles.css");
const upsView = fsextra.readFileSync("./client/ups.html");
const upsJS = fsextra.readFileSync("./client/ups.js");
const SNMPOptions = { timeout: 500, retries: 0 };
const monitorSetup = { targets: {}, parameters, pollNames };
const announcerClients = {};
const announcerHistory = [];
const poller = new XPPC(loggy);
const server = new require("http").Server();








server.on("request",(message,response) => {


	const requestedURL = message.url;
	const requestedMethod = message.method;
	const remoteAddress = message.socket.remoteAddress;
	loggy.info(`${remoteAddress} ${requestedMethod} ${requestedURL}`);


	switch(requestedMethod) {


		case "GET":
			switch(requestedURL) {


				case "/client/ups.js":

					response.writeHead(200,{ "Content-Type": "text/js" });
					response.write(upsJS);
					break;


				case "/client/announcer.js":

					response.writeHead(200,{ "Content-Type": "text/js" });
					response.write(announcerJS);
					break;


				case "/client/styles.css":

					response.writeHead(200,{ "Content-Type": "text/css" });
					response.write(styles);
					break;


				case "/ups-monitor":

					response.writeHead(200,{ "Content-Type": "text/html" });
					response.write(upsView);
					break;


				case "/announcer":

					response.writeHead(200,{ "Content-Type": "text/html" });
					response.write(announcerView);
					break;


				case "/ups-monitor-setup":

					response.writeHead(200,{ "Content-Type": "application/json" });
					response.write(JSON.stringify(monitorSetup));
					break;


				case "/announcer-setup":

					response.writeHead(200,{ "Content-Type": "application/json" });
					response.write(JSON.stringify(announcerHistory));
					break;


				default:

					loggy.warn(`${requestedURL} not found`);
					response.writeHead(404);
					break;


			}	break;


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
							loggy.info(`Received ${announce.length} symbols from ${remoteAddress}`);

							announce = `---- ${new Date()}\n${announce}`;
							announcerHistory.push(announce);
							if(100 <announcerHistory.length) announcerHistory.shift();

							Object.values(announcerClients).forEach(connection => connection.send(announce))
						}
					});	break;


				default:

					loggy.warn(`${requestedURL} not found`);
					response.writeHead(404);
					break;


			}	break;


		default:

			loggy.warn(`${requestedMethod} not supported`);
			response.writeHead(405);
			break;


	}	response.end()
});








server.on("upgrade",(req,sock,head) => {


	const requestedURL = req.url;
	const remoteAddress = sock.remoteAddress;
	const uuid = crypto.randomUUID();
	loggy.info(`${remoteAddress} UPGRADE ${requestedURL} (${uuid})`);


	if(ws.isWebSocket(req)) {

		let webSocket;

		switch(req.url) {
			case "/ups-monitor-wscast":

				let alive = true;

				webSocket = new ws(req,sock,head);
				webSocket.on("close",() => {

					loggy.info(`Closed ups-monitor websocket for ${remoteAddress} (${uuid})`);
					alive = false
				});
				webSocket.on("open", event => {

					loggy.info(`Opened ups-monitor websocket for ${remoteAddress} (${uuid})`);
					(function broadcast() { if(alive) {

						webSocket.send(JSON.stringify(poller.pollBuffer));
						setTimeout(broadcast, snmpPollTimer)

					}})()
				});	break;

			case "/announcer-wscast":

				webSocket = new ws(req,sock,head);
				webSocket.on("close",() => {

					loggy.info(`Closed announcer websocket for ${remoteAddress} (${uuid})`);
					delete announcerClients[uuid]
				});
				webSocket.on("open",() => {

					loggy.info(`Opened announcer websocket for ${remoteAddress} (${uuid})`);
					announcerClients[uuid] = webSocket

				});	break;


			default:

				loggy.warn(`${requestedURL} not found`);
				response.writeHead(404);
				break;
		}
	}
});








targets.forEach((T,i) => monitorSetup.targets[T] = names[i]);
targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions));
setInterval(() => targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions)), snmpPollTimer);
server.listen(hostPort, hostAddress,() => loggy.info(`starting ${appName} ${hostAddress}:${hostPort}`));







