







// require("dotenv").config();
const snmp = require("net-snmp");
// const community = process.env.SNMP_COMMUNITY || "";
// const targets = JSON.parse(process.env.UPS_ADDRESSES || "[]");
// const parameters = JSON.parse(process.env.UPS_SNMP_POLL_PARAMETERS || "[]");

// const { createLogger } = require("winston");
// const { Console } = require("winston").transports;
// const { File } = require("winston").transports;
// const { timestamp } = require("winston").format;
// const { combine } = require("winston").format;
// const { printf } = require("winston").format;

// const logger = createLogger({

// 	format: combine(

// 		timestamp({ format: "DD/MM/YYYY HHmm" }),
// 		printf(({ level, message, timestamp }) => `${timestamp} @${process.env.APP_NAME} ${level.toUpperCase()} : ${message}`)
// 	),
// 	transports: [

// 		new Console(),
// 		new File({ filename: process.env.LOGGY_FILE })
// 	]
// });
class Poller {

	constructor(logger) {

		this.logger = logger;
		this.pollBuffer = {}
	}

	upsSmartInputLineVoltage		= V => V ? `${V /10} V`					: "1.3.6.1.4.1.935.1.1.1.3.2.1.0";
	upsSmartBatteryVoltage			= V => V ? `${V *10} V`					: "1.3.6.1.4.1.935.1.1.1.2.2.2.0";
	upsSmartOutputLoad				= V => V ? `${V} %`						: "1.3.6.1.4.1.935.1.1.1.4.2.3.0";
	upsSmartBatteryCapacity			= V => V ? `${V} %`						: "1.3.6.1.4.1.935.1.1.1.2.2.1.0";
	upsSmartBatteryTemperature		= V => V ? `${V /10} °C`				: "1.3.6.1.4.1.935.1.1.1.2.2.3.0";
	upsSmartInputFrequency			= V => V ? `${V /10} Hz`				: "1.3.6.1.4.1.935.1.1.1.3.2.4.0";
	upsSmartBatteryRunTimeRemaining	= V => V === 0 ? "-" : V ? `${V} sec`	: "1.3.6.1.4.1.935.1.1.1.2.2.4.0";

	oidMapper = {

		"1.3.6.1.4.1.935.1.1.1.3.2.1.0": "upsSmartInputLineVoltage",
		"1.3.6.1.4.1.935.1.1.1.2.2.2.0": "upsSmartBatteryVoltage",
		"1.3.6.1.4.1.935.1.1.1.4.2.3.0": "upsSmartOutputLoad",
		"1.3.6.1.4.1.935.1.1.1.2.2.1.0": "upsSmartBatteryCapacity",
		"1.3.6.1.4.1.935.1.1.1.2.2.3.0": "upsSmartBatteryTemperature",
		"1.3.6.1.4.1.935.1.1.1.3.2.4.0": "upsSmartInputFrequency",
		"1.3.6.1.4.1.935.1.1.1.2.2.4.0": "upsSmartBatteryRunTimeRemaining"
	}
	getTarget(target, community, parameters, options) {

		if(!this.pollBuffer[target]) this.pollBuffer[target] = {};

		const current = this.pollBuffer[target];
		let   parameter;

		snmp.createSession(target, community, options)
		.get(parameters.map(para => this[para]()), (error,vars) => {

			if(error) this.logger.warn(`${target} polling error: ${error}`);
			else {

				Array.prototype.forEach.call(vars,v => {

					parameter = this.oidMapper[v.oid];

					if(snmp.isVarbindError(v)) current[parameter] = snmp.varbindError(v);
					else current[parameter] = this[parameter](v.value)

				});	this.logger.info(`${target} poll response: ${Object.keys(current).map(k => `${k}: ${current[k]}`).join(", ")}`)
			}
		})
	}
}
// const poller = new Poller(logger);
// const polling = setInterval(() => targets.forEach(T => poller.getTarget(T, community, parameters)),5000);
// const viewing = setInterval(() => console.log(poller.pollBuffer), 5000);
// setTimeout(() => clearInterval(polling),30000);
// setTimeout(() => clearInterval(viewing),30000);
module.exports = { Poller };