const assert = require("assert");
const mock = require("node:test").mock;
const XPPC = require("../modules/snmp.js").XPPC;








describe("SNMP module", function() {
	describe("XPPC handler", function() {


		const logger = { info() {}, warn() {}};
		mock.method(logger, "info");
		mock.method(logger, "warn");
		const xppc = new XPPC(logger);


		it("structured", function() {

			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0);

			assert.ok(Object.hasOwn(xppc, "oidMapper"));
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.1.1.1.0"], "upsBaseIdentModel");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.1.1.0"], "upsBaseInputPhase");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.4.1.1.0"], "upsBaseOutputStatus");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.4.1.2.0"], "upsBaseOutputPhase");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.4.2.3.0"], "upsSmartOutputLoad");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.1.0"], "upsSmartBatteryCapacity");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.2.0"], "upsSmartBatteryVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.2.1.0"], "upsSmartInputLineVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.6.0"], "upsSmartBatteryFullChargeVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.2.2.0"], "upsSmartInputMaxLineVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.2.3.0"], "upsSmartInputMinLineVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.4.2.1.0"], "upsSmartOutputVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.4.2.2.0"], "upsSmartOutputFrequency");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.2.4.0"], "upsSmartInputFrequency");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.3.0"], "upsSmartBatteryTemperature");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.5.0"], "upsSmartBatteryReplaceIndicator");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.7.0"], "upsSmartBatteryCurrent");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.4.0"], "upsSmartBatteryRunTimeRemaining");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.1.2.0"], "upsBaseBatteryTimeOnBattery");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.1.1.0"], "upsBaseBatteryStatus");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.2.5.0"], "upsSmartInputLineFailCause");

			assert.ok(Object.hasOwn(xppc, "oidDescription"));
			assert.strictEqual(xppc.oidDescription.upsBaseIdentModel, "The UPS model name (e.g. 'Intelligent 8000E 900VA').");
			assert.strictEqual(xppc.oidDescription.upsBaseInputPhase, "The current AC input phase.");
			assert.strictEqual(xppc.oidDescription.upsBaseOutputStatus, "The current state of the UPS. If the UPS is unable to determine the state of the UPS this variable is set to unknown(1).");
			assert.strictEqual(xppc.oidDescription.upsBaseOutputPhase, "The current output phase.");
			assert.strictEqual(xppc.oidDescription.upsSmartOutputLoad, "The current UPS load expressed in percent of rated capacity.");
			assert.strictEqual(xppc.oidDescription.upsSmartBatteryCapacity, "The remaining battery capacity expressed in percent of full capacity.");
			assert.strictEqual(xppc.oidDescription.upsSmartBatteryVoltage, "The current battery voltage expressed in 1/10 VDC.");
			assert.strictEqual(xppc.oidDescription.upsSmartInputLineVoltage, "The current utility line voltage in 1/10 VAC.");
			assert.strictEqual(xppc.oidDescription.upsSmartBatteryFullChargeVoltage, "The fully charged battery voltage of the battery system used in the UPS, expressed in tenths of a volt.");
			assert.strictEqual(xppc.oidDescription.upsSmartInputMaxLineVoltage, "The maximum utility line voltage in 1/10 VAC over the previous 1 minute period.");
			assert.strictEqual(xppc.oidDescription.upsSmartInputMinLineVoltage, "The minimum utility line voltage in 1/10 VAC over the previous 1 minute period.");
			assert.strictEqual(xppc.oidDescription.upsSmartOutputVoltage, "The output voltage of the UPS system in 1/10 VAC.");
			assert.strictEqual(xppc.oidDescription.upsSmartOutputFrequency, "The current output frequency of the UPS system in 1/10 Hz.");
			assert.strictEqual(xppc.oidDescription.upsSmartInputFrequency, "The current input frequency to the UPS system in 1/10 Hz.");
			assert.strictEqual(xppc.oidDescription.upsSmartBatteryTemperature, "The current internal UPS temperature expressed in tenths of a Celsius degree.");
			assert.strictEqual(xppc.oidDescription.upsSmartBatteryReplaceIndicator, "Indicates whether the UPS batteries need replacing.");
			assert.strictEqual(xppc.oidDescription.upsSmartBatteryCurrent, "The current battery current expressed in percent of maximum current.");
			assert.strictEqual(xppc.oidDescription.upsSmartBatteryRunTimeRemaining, "The UPS battery run time remaining before battery exhaustion, in seconds.");
			assert.strictEqual(xppc.oidDescription.upsBaseBatteryTimeOnBattery, "The elapsed time in seconds since the UPS has switched to battery power.");
			assert.strictEqual(xppc.oidDescription.upsBaseBatteryStatus, "The status of the UPS batteries.");
			assert.strictEqual(xppc.oidDescription.upsSmartInputLineFailCause, "The reason for the occurrence of the last transfer to UPS battery power.");

			assert.strictEqual(typeof(xppc.upsBaseIdentModel), "function");
			assert.strictEqual(typeof(xppc.upsBaseInputPhase), "function");
			assert.strictEqual(typeof(xppc.upsBaseOutputStatus), "function");
			assert.strictEqual(typeof(xppc.upsBaseOutputPhase), "function");
			assert.strictEqual(typeof(xppc.upsSmartOutputLoad), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryCapacity), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartInputLineVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryFullChargeVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartInputMaxLineVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartInputMinLineVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartOutputVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartOutputFrequency), "function");
			assert.strictEqual(typeof(xppc.upsSmartInputFrequency), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryTemperature), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryReplaceIndicator), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryCurrent), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryRunTimeRemaining), "function");
			assert.strictEqual(typeof(xppc.upsBaseBatteryTimeOnBattery), "function");
			assert.strictEqual(typeof(xppc.upsBaseBatteryStatus), "function");
			assert.strictEqual(typeof(xppc.upsSmartInputLineFailCause), "function");
		});
		it("buffering", function() {

			assert.strictEqual(typeof(xppc.pollBuffer), "object");
			assert.deepStrictEqual(xppc.checkoutBuffer("target"),{});

			xppc.pollBuffer["target"]["foo"] = "bar";
			assert.deepStrictEqual(xppc.checkoutBuffer("target"),{ foo: "bar" });

			xppc.clearBuffer("target");
			assert.deepStrictEqual(xppc.checkoutBuffer("target"),{});

			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0);
		});
		it("valid upsBaseIdentModel", function() {

			assert.strictEqual(xppc.upsBaseIdentModel(), "1.3.6.1.4.1.935.1.1.1.1.1.1.0");
			assert.strictEqual(xppc.upsBaseIdentModel("Intelligent 8000E 900VA"), "Intelligent 8000E 900VA");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsBaseInputPhase", function() {

			assert.strictEqual(xppc.upsBaseInputPhase(), "1.3.6.1.4.1.935.1.1.1.3.1.1.0");
			assert.strictEqual(xppc.upsBaseInputPhase(1), "1");
			assert.strictEqual(xppc.upsBaseInputPhase(2), "2");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsBaseOutputStatus", function() {

			assert.strictEqual(xppc.upsBaseOutputStatus(), "1.3.6.1.4.1.935.1.1.1.4.1.1.0");
			assert.strictEqual(xppc.upsBaseOutputStatus(1), "1");
			assert.strictEqual(xppc.upsBaseOutputStatus(2), "2");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsBaseOutputPhase", function() {

			assert.strictEqual(xppc.upsBaseOutputPhase(), "1.3.6.1.4.1.935.1.1.1.4.1.2.0");
			assert.strictEqual(xppc.upsBaseOutputPhase(1), "1");
			assert.strictEqual(xppc.upsBaseOutputPhase(2), "2");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartOutputLoad", function() {

			assert.strictEqual(xppc.upsSmartOutputLoad(), "1.3.6.1.4.1.935.1.1.1.4.2.3.0");
			assert.strictEqual(xppc.upsSmartOutputLoad(100), "100 %");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartBatteryCapacity", function() {

			assert.strictEqual(xppc.upsSmartBatteryCapacity(), "1.3.6.1.4.1.935.1.1.1.2.2.1.0");
			assert.strictEqual(xppc.upsSmartBatteryCapacity(100), "100 %");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartBatteryVoltage", function() {

			assert.strictEqual(xppc.upsSmartBatteryVoltage(), "1.3.6.1.4.1.935.1.1.1.2.2.2.0");
			assert.strictEqual(xppc.upsSmartBatteryVoltage(2), "20 V");
			assert.strictEqual(xppc.upsSmartBatteryVoltage(22), "220 V");
			assert.strictEqual(xppc.upsSmartBatteryVoltage(22.8), "228 V");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartInputLineVoltage", function() {

			assert.strictEqual(xppc.upsSmartInputLineVoltage(), "1.3.6.1.4.1.935.1.1.1.3.2.1.0");
			assert.strictEqual(xppc.upsSmartInputLineVoltage(220), "22 V");
			assert.strictEqual(xppc.upsSmartInputLineVoltage(2200), "220 V");
			assert.strictEqual(xppc.upsSmartInputLineVoltage(2208), "220.8 V");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartBatteryFullChargeVoltage", function() {

			assert.strictEqual(xppc.upsSmartBatteryFullChargeVoltage(), "1.3.6.1.4.1.935.1.1.1.2.2.6.0");
			assert.strictEqual(xppc.upsSmartBatteryFullChargeVoltage(9.6), "0.96 V");
			assert.strictEqual(xppc.upsSmartBatteryFullChargeVoltage(96), "9.6 V");
			assert.strictEqual(xppc.upsSmartBatteryFullChargeVoltage(960), "96 V");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartInputMaxLineVoltage", function() {

			assert.strictEqual(xppc.upsSmartInputMaxLineVoltage(), "1.3.6.1.4.1.935.1.1.1.3.2.2.0");
			assert.strictEqual(xppc.upsSmartInputMaxLineVoltage(220), "22 V");
			assert.strictEqual(xppc.upsSmartInputMaxLineVoltage(2200), "220 V");
			assert.strictEqual(xppc.upsSmartInputMaxLineVoltage(2208), "220.8 V");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartInputMinLineVoltage", function() {

			assert.strictEqual(xppc.upsSmartInputMinLineVoltage(), "1.3.6.1.4.1.935.1.1.1.3.2.3.0");
			assert.strictEqual(xppc.upsSmartInputMinLineVoltage(220), "22 V");
			assert.strictEqual(xppc.upsSmartInputMinLineVoltage(2200), "220 V");
			assert.strictEqual(xppc.upsSmartInputMinLineVoltage(2208), "220.8 V");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartOutputVoltage", function() {

			assert.strictEqual(xppc.upsSmartOutputVoltage(), "1.3.6.1.4.1.935.1.1.1.4.2.1.0");
			assert.strictEqual(xppc.upsSmartOutputVoltage(220), "22 V");
			assert.strictEqual(xppc.upsSmartOutputVoltage(2200), "220 V");
			assert.strictEqual(xppc.upsSmartOutputVoltage(2208), "220.8 V");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartOutputFrequency", function() {

			assert.strictEqual(xppc.upsSmartOutputFrequency(), "1.3.6.1.4.1.935.1.1.1.4.2.2.0");
			assert.strictEqual(xppc.upsSmartOutputFrequency(50), "5 Hz");
			assert.strictEqual(xppc.upsSmartOutputFrequency(500), "50 Hz");
			assert.strictEqual(xppc.upsSmartOutputFrequency(499), "49.9 Hz");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartInputFrequency", function() {

			assert.strictEqual(xppc.upsSmartInputFrequency(), "1.3.6.1.4.1.935.1.1.1.3.2.4.0");
			assert.strictEqual(xppc.upsSmartInputFrequency(50), "5 Hz");
			assert.strictEqual(xppc.upsSmartInputFrequency(500), "50 Hz");
			assert.strictEqual(xppc.upsSmartInputFrequency(499), "49.9 Hz");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartBatteryTemperature", function() {

			assert.strictEqual(xppc.upsSmartBatteryTemperature(), "1.3.6.1.4.1.935.1.1.1.2.2.3.0");
			assert.strictEqual(xppc.upsSmartBatteryTemperature(22), "2.2 °C");
			assert.strictEqual(xppc.upsSmartBatteryTemperature(220), "22 °C");
			assert.strictEqual(xppc.upsSmartBatteryTemperature(228), "22.8 °C");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartBatteryReplaceIndicator", function() {

			assert.strictEqual(xppc.upsSmartBatteryReplaceIndicator(), "1.3.6.1.4.1.935.1.1.1.2.2.5.0");
			assert.strictEqual(xppc.upsSmartBatteryReplaceIndicator(0), "-");
			assert.strictEqual(xppc.upsSmartBatteryReplaceIndicator(1), "+");
			assert.strictEqual(xppc.upsSmartBatteryReplaceIndicator(2), "+");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartBatteryCurrent", function() {

			assert.strictEqual(xppc.upsSmartBatteryCurrent(), "1.3.6.1.4.1.935.1.1.1.2.2.7.0");
			assert.strictEqual(xppc.upsSmartBatteryCurrent(0), "-");
			assert.strictEqual(xppc.upsSmartBatteryCurrent(1), "1 %");
			assert.strictEqual(xppc.upsSmartBatteryCurrent(25), "25 %");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartBatteryRunTimeRemaining", function() {

			assert.strictEqual(xppc.upsSmartBatteryRunTimeRemaining(), "1.3.6.1.4.1.935.1.1.1.2.2.4.0");
			assert.strictEqual(xppc.upsSmartBatteryRunTimeRemaining(0), "-");
			assert.strictEqual(xppc.upsSmartBatteryRunTimeRemaining(1), "1 sec");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsBaseBatteryTimeOnBattery", function() {

			assert.strictEqual(xppc.upsBaseBatteryTimeOnBattery(), "1.3.6.1.4.1.935.1.1.1.2.1.2.0");
			assert.strictEqual(xppc.upsBaseBatteryTimeOnBattery(0), "-");
			assert.strictEqual(xppc.upsBaseBatteryTimeOnBattery(1), "1 sec");
			assert.strictEqual(xppc.upsBaseBatteryTimeOnBattery(2500), "2500 sec");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsBaseBatteryStatus", function() {

			assert.strictEqual(xppc.upsBaseBatteryStatus(), "1.3.6.1.4.1.935.1.1.1.2.1.1.0");
			assert.strictEqual(xppc.upsBaseBatteryStatus(0), "excelent");
			assert.strictEqual(xppc.upsBaseBatteryStatus(1), "good");
			assert.strictEqual(xppc.upsBaseBatteryStatus(2), "normal");
			assert.strictEqual(xppc.upsBaseBatteryStatus(3), "low");
			assert.strictEqual(xppc.upsBaseBatteryStatus(4), "undefined(4)");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
		it("valid upsSmartInputLineFailCause", function() {

			assert.strictEqual(xppc.upsSmartInputLineFailCause(), "1.3.6.1.4.1.935.1.1.1.3.2.5.0");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(0), "undefined(0)");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(1), "no transfer yet");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(2), "transfer to battery is caused by an over voltage greater than the high transfer voltage");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(3), "the duration of the outage is greater than five seconds and the line voltage is between 40 percent of the rated output voltage and the low transfer voltage");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(4), "the duration of the outage is greater than five seconds and the line voltage is between 40 percent of the rated output voltage and ground");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(5), "the duration of the outage is less than five seconds and the line voltage is between 40 percent of the rated output voltage and the low transfer voltage");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(6), "the duration of the outage is less than five seconds and the line voltage is between 40 percent of the rated output voltage and ground");
			assert.strictEqual(xppc.upsSmartInputLineFailCause(7), "undefined(7)");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		})
	})
})







