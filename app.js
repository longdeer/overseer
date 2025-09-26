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
const poller = new XPPC(loggy);
const SNMPOptions = { timeout: 500, retries: 0 };
const server = require("./modules/server.js");
const serverOptions = {

	snmp: {

		poller,
		targets: {},
		pollTimer: snmpPollTimer,
		parameters,
		descriptions: pollNames
	}
}








targets.forEach((T,i) => serverOptions.snmp.targets[T] = names[i]);
targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions));
setInterval(() => targets.forEach(T => poller.getTarget(T, community, parameters, SNMPOptions)), snmpPollTimer);
new server(serverOptions, loggy)
.server
.listen(hostPort, hostAddress,() => loggy.info(`starting ${appName} ${hostAddress}:${hostPort}`));







