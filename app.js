







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
const upsJS = require("fs").readFileSync("./client/ups.js");
const styles = require("fs").readFileSync("./client/styles.css");
const server = new require("http").Server();








server.on("request",(req,res) => {
	switch(req.url) {

		case "/client/ups.js":

			res.writeHead(200,{ "Content-Type": "text/js" });
			res.write(upsJS);
			break;

		case "/client/styles.css":

			res.writeHead(200,{ "Content-Type": "text/css" });
			res.write(styles);
			break;

		case "/ups-monitor":

			res.writeHead(200,{ "Content-Type": "text/html" });
			res.write(upsView);
			break;

		case "/ups-monitor-setup":

			res.writeHead(200,{ "Content-Type": "application/json" });
			res.write(JSON.stringify(setup));
			break;

		default: res.writeHead(404); break;
	}	res.end()
});


server.on("upgrade",(req,sock,head) => {
	if(req.url === "/ups-monitor-wscast" && ws.isWebSocket(req)) {

		const connection = new ws(req,sock,head);
		let   alive = true;

		connection.on("close",() => alive = false);
		connection.on("open", event => {

			(function broadcast() {
				if(alive) {

					connection.send(JSON.stringify(poller.pollBuffer));
					setTimeout(broadcast,5000)
				}
			})()
		})
	}
});








targets.forEach((T,i) => setup.targets[T] = names[i]);
targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions));
setInterval(() => targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions)),5000);
server.listen(16200,() => logger.info("starting listening"));







