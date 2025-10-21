







class XPPC {
	constructor(logger) {

		this.snmp = require("net-snmp");
		this.loggy = logger;
		this.pollBuffer = {}
	}
	upsBaseIdentModel					= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.1.1.1.0" :	`${V}`;
	upsBaseInputPhase					= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.3.1.1.0" :	`${V}`;
	upsBaseOutputStatus					= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.4.1.1.0" :	`${V}`;
	upsBaseOutputPhase					= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.4.1.2.0" :	`${V}`;
	upsSmartOutputLoad					= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.4.2.3.0" :	`${V} %`;
	upsSmartBatteryCapacity				= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.2.1.0" :	`${V} %`;
	upsSmartBatteryVoltage				= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.2.2.0" :	`${V *10} V`;
	upsSmartInputLineVoltage			= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.3.2.1.0" :	`${V /10} V`;
	upsSmartBatteryFullChargeVoltage	= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.2.6.0" :	`${V /10} V`;
	upsSmartInputMaxLineVoltage			= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.3.2.2.0" :	`${V /10} V`;
	upsSmartInputMinLineVoltage			= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.3.2.3.0" :	`${V /10} V`;
	upsSmartOutputVoltage				= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.4.2.1.0" :	`${V /10} V`;
	upsSmartOutputFrequency				= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.4.2.2.0" :	`${V /10} Hz`;
	upsSmartInputFrequency				= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.3.2.4.0" :	`${V /10} Hz`;
	upsSmartBatteryTemperature			= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.2.3.0" :	`${V /10} °C`;
	upsSmartBatteryReplaceIndicator		= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.2.5.0" :	V === 0 ? "-" : "+";
	upsSmartBatteryCurrent				= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.2.7.0" :	0 <V ? `${V} %` : "-";
	upsSmartBatteryRunTimeRemaining		= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.2.4.0" :	0 <V ? `${V} sec` : "-";
	upsBaseBatteryTimeOnBattery			= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.1.2.0" :	0 <V ? `${V} sec` : "-";
	upsBaseBatteryStatus				= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.2.1.1.0" :	V === 0 ? "excelent" : V === 1 ? "good" : V === 2 ? "normal" : V === 3 ? "low" : `undefined(${V})`;
	upsSmartInputLineFailCause			= V => V === undefined ? "1.3.6.1.4.1.935.1.1.1.3.2.5.0" :	V === 1 ? "no transfer yet" :
																									V === 2 ? "transfer to battery is caused by an over voltage greater than the high transfer voltage" :
																									V === 3 ? "the duration of the outage is greater than five seconds and the line voltage is between 40 percent of the rated output voltage and the low transfer voltage" :
																									V === 4 ? "the duration of the outage is greater than five seconds and the line voltage is between 40 percent of the rated output voltage and ground" :
																									V === 5 ? "the duration of the outage is less than five seconds and the line voltage is between 40 percent of the rated output voltage and the low transfer voltage" :
																									V === 6 ? "the duration of the outage is less than five seconds and the line voltage is between 40 percent of the rated output voltage and ground" :
																									`undefined(${V})`;
	oidMapper = {

		"1.3.6.1.4.1.935.1.1.1.1.1.1.0":	"upsBaseIdentModel",
		"1.3.6.1.4.1.935.1.1.1.3.1.1.0":	"upsBaseInputPhase",
		"1.3.6.1.4.1.935.1.1.1.4.1.1.0":	"upsBaseOutputStatus",
		"1.3.6.1.4.1.935.1.1.1.4.1.2.0":	"upsBaseOutputPhase",
		"1.3.6.1.4.1.935.1.1.1.4.2.3.0":	"upsSmartOutputLoad",
		"1.3.6.1.4.1.935.1.1.1.2.2.1.0":	"upsSmartBatteryCapacity",
		"1.3.6.1.4.1.935.1.1.1.2.2.2.0":	"upsSmartBatteryVoltage",
		"1.3.6.1.4.1.935.1.1.1.3.2.1.0":	"upsSmartInputLineVoltage",
		"1.3.6.1.4.1.935.1.1.1.2.2.6.0":	"upsSmartBatteryFullChargeVoltage",
		"1.3.6.1.4.1.935.1.1.1.3.2.2.0":	"upsSmartInputMaxLineVoltage",
		"1.3.6.1.4.1.935.1.1.1.3.2.3.0":	"upsSmartInputMinLineVoltage",
		"1.3.6.1.4.1.935.1.1.1.4.2.1.0":	"upsSmartOutputVoltage",
		"1.3.6.1.4.1.935.1.1.1.4.2.2.0":	"upsSmartOutputFrequency",
		"1.3.6.1.4.1.935.1.1.1.3.2.4.0":	"upsSmartInputFrequency",
		"1.3.6.1.4.1.935.1.1.1.2.2.3.0":	"upsSmartBatteryTemperature",
		"1.3.6.1.4.1.935.1.1.1.2.2.5.0":	"upsSmartBatteryReplaceIndicator",
		"1.3.6.1.4.1.935.1.1.1.2.2.7.0":	"upsSmartBatteryCurrent",
		"1.3.6.1.4.1.935.1.1.1.2.2.4.0":	"upsSmartBatteryRunTimeRemaining",
		"1.3.6.1.4.1.935.1.1.1.2.1.2.0":	"upsBaseBatteryTimeOnBattery",
		"1.3.6.1.4.1.935.1.1.1.2.1.1.0":	"upsBaseBatteryStatus",
		"1.3.6.1.4.1.935.1.1.1.3.2.5.0":	"upsSmartInputLineFailCause",
	}
	oidDescription = {

		upsBaseIdentModel:					"The UPS model name (e.g. 'Intelligent 8000E 900VA').",
		upsBaseInputPhase:					"The current AC input phase.",
		upsBaseOutputStatus:				"The current state of the UPS. If the UPS is unable to determine the state of the UPS this variable is set to unknown(1).",
		upsBaseOutputPhase:					"The current output phase.",
		upsSmartOutputLoad:					"The current UPS load expressed in percent of rated capacity.",
		upsSmartBatteryCapacity:			"The remaining battery capacity expressed in percent of full capacity.",
		upsSmartBatteryVoltage:				"The current battery voltage expressed in 1/10 VDC.",
		upsSmartInputLineVoltage:			"The current utility line voltage in 1/10 VAC.",
		upsSmartBatteryFullChargeVoltage:	"The fully charged battery voltage of the battery system used in the UPS, expressed in tenths of a volt.",
		upsSmartInputMaxLineVoltage:		"The maximum utility line voltage in 1/10 VAC over the previous 1 minute period.",
		upsSmartInputMinLineVoltage:		"The minimum utility line voltage in 1/10 VAC over the previous 1 minute period.",
		upsSmartOutputVoltage:				"The output voltage of the UPS system in 1/10 VAC.",
		upsSmartOutputFrequency:			"The current output frequency of the UPS system in 1/10 Hz.",
		upsSmartInputFrequency:				"The current input frequency to the UPS system in 1/10 Hz.",
		upsSmartBatteryTemperature:			"The current internal UPS temperature expressed in tenths of a Celsius degree.",
		upsSmartBatteryReplaceIndicator:	"Indicates whether the UPS batteries need replacing.",
		upsSmartBatteryCurrent:				"The current battery current expressed in percent of maximum current.",
		upsSmartBatteryRunTimeRemaining:	"The UPS battery run time remaining before battery exhaustion, in seconds.",
		upsBaseBatteryTimeOnBattery:		"The elapsed time in seconds since the UPS has switched to battery power.",
		upsBaseBatteryStatus:				"The status of the UPS batteries.",
		upsSmartInputLineFailCause:			"The reason for the occurrence of the last transfer to UPS battery power.",
	}
	clearBuffer(target) {

		this.pollBuffer[target] = {}
	}
	checkoutBuffer(target) {

		if(!this.pollBuffer[target]) this.clearBuffer(target);
		return this.pollBuffer[target]
	}
	getTargetBuffered(target, community, parameters, options) {

		let   parameter;
		const current = this.checkoutBuffer(target);
		const session = this.snmp.createSession(target, community, options);

		session.get(parameters.map(para => this[para]()), (error,vars) => {

			/*
			 * In case new data couldn't be fetched,
			 * the buffer state will be wiped for target,
			 * so the frontend will be awared.
			 */

			if(error) {

				this.loggy.warn(`${target} polling error: ${error}`);
				this.clearBuffer(target)
			}
			else {

				Array.prototype.forEach.call(vars,v => {

					parameter = this.oidMapper[v.oid];

					if(this.snmp.isVarbindError(v)) current[parameter] = this.snmp.varbindError(v);
					else current[parameter] = this[parameter](v.value)

				});	this.loggy.info(`${target} poll response: ${Object.keys(current).map(k => `${k}: ${current[k]}`).join(", ")}`)
			}
			session.close()
		})
	}
	walkBuffered(target, community, options) {

		let   description;
		let   parameter;
		const current = this.checkoutBuffer(target);
		const session = this.snmp.createSession(target, community, options);

		session.get(Object.keys(this.oidMapper),(error,vars) => {

			/*
			 * In case new data couldn't be fetched,
			 * the buffer state will be wiped for target,
			 * so the frontend will be awared.
			 */

			if(error) {

				this.loggy.warn(`${target} polling error: ${error}`);
				this.clearBuffer(target)
			}
			else {

				Array.prototype.forEach.call(vars,v => {

					parameter = this.oidMapper[v.oid];
					description = this.oidDescription[parameter];

					if(this.snmp.isVarbindError(v)) current[parameter] = [ "error",this.snmp.varbindError(v) ];
					else current[parameter] = this[parameter](v.value)

				});	this.loggy.info(`${target} poll response: ${Object.keys(current).map(k => `${k}: ${current[k]}`).join(", ")}`)
			}
			session.close()
		})
	}
	getTarget(target, community, parameters, options) {
		return new Promise((RES,REJ) => {

			let   parameter;
			const current = {};
			const session = this.snmp.createSession(target, community, options)

			session.get(parameters.map(para => this[para]()), (error,vars) => {

				if(error) {

					this.loggy.warn(`${target} polling error: ${error}`);
					REJ(`${target} polling error: ${error}`)

				}	else {

					Array.prototype.forEach.call(vars,v => {

						parameter = this.oidMapper[v.oid];

						if(this.snmp.isVarbindError(v)) current[parameter] = this.snmp.varbindError(v);
						else current[parameter] = this[parameter](v.value)

					});	this.loggy.info(`${target} poll response: ${Object.keys(current).map(k => `${k}: ${current[k]}`).join(", ")}`)
				}
				session.close();
				RES(current)
			})
		})
	}
	walk(target, community, options) {
		return new Promise((RES,REJ) => {

			let   description;
			let   parameter;
			const current = {};
			const session = this.snmp.createSession(target, community, options)

			session.get(Object.keys(this.oidMapper),(error,vars) => {

				if(error) {

					this.loggy.warn(`${target} polling error: ${error}`);
					REJ(`${target} polling error: ${error}`)

				}	else {

					Array.prototype.forEach.call(vars,v => {

						parameter = this.oidMapper[v.oid];
						description = this.oidDescription[parameter];

						if(this.snmp.isVarbindError(v)) current[parameter] = [ "error",this.snmp.varbindError(v) ];
						else current[parameter] = [ this[parameter](v.value),description ]
					})
				}
				session.close();
				RES(current)
			})
		})
	}
	schedule(options, target, community, interval, parameters) {

		if(Array.isArray(parameters)) {
			if(Array.isArray(target)) {

				this.loggy.info(`Scheduling ${target.length} targets polling ${parameters.length} parameters`);
				target.forEach(T => this.getTargetBuffered(T, community, parameters, options));
				return setInterval(() => target.forEach(T => this.getTargetBuffered(T, community, parameters, options)), interval)

			}	else {

				this.loggy.info(`Scheduling ${target} polling ${parameters.length} parameters`);
				this.getTargetBuffered(target, community, parameters, options);
				return setInterval(() => this.getTargetBuffered(target, community, parameters, options), interval)
			}
		}	else {

			if(Array.isArray(target)) {

				this.loggy.info(`Scheduling ${target.length} targets walk`);
				target.forEach(T => this.walkBuffered(T, community, options));
				return setInterval(() => target.forEach(T => this.walkBuffered(T, community, options)), interval)

			}	else {

				this.loggy.info(`Scheduling ${target} walk`);
				this.walkBuffered(target, community, options);
				return setInterval(() => this.walkBuffered(target, community, options), interval)
			}
		}
	}
	unschedule(intervalId) {

		this.loggy.info(`Unscheduling interval id ${intervalId}`);
		clearInterval(intervalId)
	}
}








module.exports.XPPC = XPPC;







