require("dotenv").config({ quiet: true });
const snmpCommunity = process.env.SNMP_COMMUNITY || "";
const snmpPollNames = JSON.parse(process.env.UPS_NAMES || "[]");
const snmpPollTargets = JSON.parse(process.env.UPS_ADDRESSES || "[]");
const snmpPollDescritptions = JSON.parse(process.env.UPS_SNMP_POLL_NAMES || "[]");
const snmpPollParameters = JSON.parse(process.env.UPS_SNMP_POLL_PARAMETERS || "[]");
const snmpPollTimer = process.env.UPS_SNMP_POLL_TIMER;
const hostAddress = process.env.LISTEN_ADDRESS;
const hostPort = process.env.LISTEN_PORT;
const appName = process.env.APP_NAME;
const Reader = require("./modules/reader.js");
const loggy = require("./modules/loggy.js").getRotatedLoggy(process.env.LOGGY_FOLDER, appName);
const XPPC = require("./modules/snmp.js").XPPC;
const snmpPoller = new XPPC(loggy);
const SNMPOptions = { timeout: 500, retries: 0 };
const serverOptions = {

	reader: new Reader(JSON.parse(process.env.READER_PATHS || "[]")),
	snmp: {

		descriptions: snmpPollDescritptions,
		parameters: snmpPollParameters,
		pollTimer: snmpPollTimer,
		poller: snmpPoller,
		targets: {}
	}
}
const server = require("./modules/server.js");
const session = new server(serverOptions, loggy);
snmpPollTargets.forEach((T,i) => serverOptions.snmp.targets[T] = snmpPollNames[i]);
snmpPoller.schedule(SNMPOptions, snmpPollTargets, snmpCommunity, snmpPollTimer, snmpPollParameters);
session.server.listen(hostPort, hostAddress,() => loggy.info(`starting ${appName} ${hostAddress}:${hostPort}`));







