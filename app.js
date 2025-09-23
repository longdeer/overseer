







require("dotenv").config();


const { createLogger } = require("winston");
const { Console } = require("winston").transports;
const { File } = require("winston").transports;
const { timestamp } = require("winston").format;
const { combine } = require("winston").format;
const { printf } = require("winston").format;
const logger = createLogger({

	format: combine(

		timestamp({ format: "DD/MM/YYYY HHmm" }),
		printf(({ level, message, timestamp }) => `${timestamp} @${process.env.APP_NAME.toLowerCase()} ${level.toUpperCase()} : ${message}`)
	),
	transports: [

		new Console(),
		new File({ filename: process.env.LOGGY_FILE })
	]
});
const { XPPC } = require("./modules/snmp.js");
const poller = new XPPC(logger);
const SNMPOptions = { timeout: 500, retries: 0 };
const community = process.env.SNMP_COMMUNITY || "";
const names = JSON.parse(process.env.UPS_NAMES || "[]");
const targets = JSON.parse(process.env.UPS_ADDRESSES || "[]");
const pollNames = JSON.parse(process.env.UPS_SNMP_POLL_NAMES || "[]");
const parameters = JSON.parse(process.env.UPS_SNMP_POLL_PARAMETERS || "[]");
const setup = { targets: {}, parameters, pollNames };
const ws = require("faye-websocket");
const upsView = require("fs").readFileSync("./client/ups.html");
const announcerView = require("fs").readFileSync("./client/announcer.html");
const upsJS = require("fs").readFileSync("./client/ups.js");
const announcerJS = require("fs").readFileSync("./client/announcer.js");
const styles = require("fs").readFileSync("./client/styles.css");
const server = new require("http").Server();
const crypto = require("crypto");
const announcerClients = {};








server.on("request",(message,response) => {
	switch(message.method) {


		case "GET":
			switch(message.url) {


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
					response.write(JSON.stringify(setup));
					break;


				default: response.writeHead(404); break;
			}	break;


		case "POST":
			switch(message.url) {

				case "/announcer-receiver":

					let data;
					let announce;
					let raw = "";

					message.on("data",chunk => raw += chunk);
					message.on("end",() => {

						data = JSON.parse(raw);
						if(data && typeof(data) === "object" && Object.hasOwn(data, "message")) {

							announce = `---- ${new Date()}\n${data.message}`;
							Object.values(announcerClients).forEach(connection => connection.send(announce))
						}
					});	break;


				default: response.writeHead(404); break;
			}	break;


		default: response.writeHead(405); break;
	}	response.end()
});








server.on("upgrade",(req,sock,head) => {
	if(ws.isWebSocket(req)) {

		let connection;

		switch(req.url) {
			case "/ups-monitor-wscast":

				let alive = true;
				connection = new ws(req,sock,head);

				connection.on("close",() => alive = false);
				connection.on("open", event => {

					(function broadcast() { if(alive) {

						connection.send(JSON.stringify(poller.pollBuffer));
						setTimeout(broadcast,5000)

					}})()
				});	break;

			case "/announcer-wscast":

				connection = new ws(req,sock,head);
				const uuid = crypto.randomUUID();

				connection.on("close",() => delete announcerClients[uuid]);
				connection.on("open",() => announcerClients[uuid] = connection);

				break;
		}
	}
});








// targets.forEach((T,i) => setup.targets[T] = names[i]);
// targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions));
// setInterval(() => targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions)),5000);
server.listen(16200,() => logger.info("starting listening"));







