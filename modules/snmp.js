







module.exports.XPPC = class XPPC {

	constructor(logger) {

		this.snmp = require("net-snmp");
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

		this.snmp.createSession(target, community, options)
		.get(parameters.map(para => this[para]()), (error,vars) => {

			if(error) this.logger.warn(`${target} polling error: ${error}`);
			else {

				Array.prototype.forEach.call(vars,v => {

					parameter = this.oidMapper[v.oid];

					if(this.snmp.isVarbindError(v)) current[parameter] = this.snmp.varbindError(v);
					else current[parameter] = this[parameter](v.value)

				});	this.logger.info(`${target} poll response: ${Object.keys(current).map(k => `${k}: ${current[k]}`).join(", ")}`)
			}
		})
	}
}







