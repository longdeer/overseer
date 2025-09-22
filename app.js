







// import Poller from "./snmp.js";
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
		printf(({ level, message, timestamp }) => `${timestamp} @${process.env.APP_NAME} ${level.toUpperCase()} : ${message}`)
	),
	transports: [

		// new Console(),
		new File({ filename: process.env.LOGGY_FILE })
	]
});
const http = require("http");
const ws = require("faye-websocket");
const upsView = require("fs").readFileSync("./client/ups.html");
const upsJS = require("fs").readFileSync("./client/ups.js");
const styles = require("fs").readFileSync("./client/styles.css");
const server = new http.Server();


const { Poller } = require("./snmp.js")
const poller = new Poller(logger);
const SNMPOptions = { timeout: 500, retries: 0 };
const community = process.env.SNMP_COMMUNITY || "";
const names = JSON.parse(process.env.UPS_NAMES || "[]");
const targets = JSON.parse(process.env.UPS_ADDRESSES || "[]");
const pollNames = JSON.parse(process.env.UPS_SNMP_POLL_NAMES || "[]");
const parameters = JSON.parse(process.env.UPS_SNMP_POLL_PARAMETERS || "[]");
const setup = { targets: {}, parameters, pollNames };
targets.forEach((T,i) => setup.targets[T] = names[i]);
// parameters.forEach((P,i) => setup.measure[P] = pollNames[i]);


// const buffer = [ 0 ];
// (function rander() {

// 	buffer[0] = Math.random();
// 	setTimeout(rander,5000)
// })()


server.on("request",(req,res) => {

	// console.log(req.url);
	// console.log(arguments);
	// res.writeHead(200,{ "Content-Type": "text/html" });
	// res.write(upsView);
	// res.end()
	switch(req.url) {

		case "/client/ups.js":

			// console.log("js");
			res.writeHead(200,{ "Content-Type": "text/js" });
			res.write(upsJS);
			res.end();
			break;

		case "/client/styles.css":

			// console.log("styles");
			res.writeHead(200,{ "Content-Type": "text/css" });
			res.write(styles);
			res.end();
			break;

		case "/ups-monitor":

			// console.log("ups-monitor");
			res.writeHead(200,{ "Content-Type": "text/html" });
			res.write(upsView);
			res.end();
			break;

		case "/ups-monitor-setup":

			// console.log("ups-monitor-setup");
			res.writeHead(200,{ "Content-Type": "application/json" });
			res.write(JSON.stringify(setup));
			res.end();
			break;

		default:

			console.log("default");
			res.writeHead(404); res.end(); break;
	}
});
server.on("upgrade",(req,sock,head) => {
	console.log("AAA")
	if(req.url === "/ups-monitor-wscast" && ws.isWebSocket(req)) {

		const connection = new ws(req,sock,head);
		let   alive = true;
		// console.log("AAAAAAAAAA")

		connection.on("open", event => {

			(function broadcast() {
				console.log("serving");
				// logger.info("serving");
				if(alive) {

					// console.log(poller.pollBuffer);
					// logger.info(poller.pollBuffer);
					connection.send(JSON.stringify(poller.pollBuffer));
					// connection.send("poller.pollBuffer");
					setTimeout(broadcast,5000)
				}
			})()
		})
		connection.on("close", () => {

			console.log("closing");
			alive = false;
		})
	}
});
targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions));
setInterval(() => targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions)),5000);
// console.log("WTF???")
server.listen(16200,() => logger.info("starting listening"));







