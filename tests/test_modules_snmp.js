const assert = require("assert");
const mock = require("node:test").mock;
const XPPC = require("../modules/snmp.js").XPPC;








describe("SNMP module", function() {
	describe("MIB XPPC handler", function() {


		const logger = { info() {}, warn() {}};
		mock.method(logger, "info");
		mock.method(logger, "warn");
		const xppc = new XPPC(logger);


		it("structured", function() {

			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0);

			assert.ok(Object.hasOwn(xppc, "oidMapper"));
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.2.1.0"], "upsSmartInputLineVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.2.0"], "upsSmartBatteryVoltage");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.4.2.3.0"], "upsSmartOutputLoad");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.1.0"], "upsSmartBatteryCapacity");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.3.0"], "upsSmartBatteryTemperature");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.3.2.4.0"], "upsSmartInputFrequency");
			assert.strictEqual(xppc.oidMapper["1.3.6.1.4.1.935.1.1.1.2.2.4.0"], "upsSmartBatteryRunTimeRemaining");

			assert.strictEqual(typeof(xppc.upsSmartInputLineVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryVoltage), "function");
			assert.strictEqual(typeof(xppc.upsSmartOutputLoad), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryCapacity), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryTemperature), "function");
			assert.strictEqual(typeof(xppc.upsSmartInputFrequency), "function");
			assert.strictEqual(typeof(xppc.upsSmartBatteryRunTimeRemaining), "function");
		});
		it("buffering", function() {

			assert.strictEqual(typeof(xppc.pollBuffer), "object");
			assert.deepStrictEqual(xppc.checkoutBuffer("target"),{});

			xppc.pollBuffer["target"]["foo"] = "bar";
			assert.deepStrictEqual(xppc.checkoutBuffer("target"),{ foo: "bar" });

			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0);
		});
		it("valid upsSmartInputLineVoltage", function() {

			assert.strictEqual(xppc.upsSmartInputLineVoltage(), "1.3.6.1.4.1.935.1.1.1.3.2.1.0");
			assert.strictEqual(xppc.upsSmartInputLineVoltage(220), "22 V");
			assert.strictEqual(xppc.upsSmartInputLineVoltage(2200), "220 V");
			assert.strictEqual(xppc.upsSmartInputLineVoltage(2208), "220.8 V");
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
		it("valid upsSmartBatteryTemperature", function() {

			assert.strictEqual(xppc.upsSmartBatteryTemperature(), "1.3.6.1.4.1.935.1.1.1.2.2.3.0");
			assert.strictEqual(xppc.upsSmartBatteryTemperature(22), "2.2 °C");
			assert.strictEqual(xppc.upsSmartBatteryTemperature(220), "22 °C");
			assert.strictEqual(xppc.upsSmartBatteryTemperature(228), "22.8 °C");
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
		it("valid upsSmartBatteryRunTimeRemaining", function() {

			assert.strictEqual(xppc.upsSmartBatteryRunTimeRemaining(), "1.3.6.1.4.1.935.1.1.1.2.2.4.0");
			assert.strictEqual(xppc.upsSmartBatteryRunTimeRemaining(0), "-");
			assert.strictEqual(xppc.upsSmartBatteryRunTimeRemaining(1), "1 sec");
			assert.strictEqual(logger.info.mock.callCount(),0);
			assert.strictEqual(logger.warn.mock.callCount(),0)
		});
	})
})







