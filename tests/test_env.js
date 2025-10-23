require("dotenv").config({ quiet: true });
const { isAbsolute } = require("path");
const fsextra = require("fs-extra");
const assert = require("assert");
const ip4regex = /((25[0-5]|2[0-4]\d|1\d\d|\d\d?)\.){3}(25[0-5]|2[0-4]\d|1\d\d|\d\d?)/;








describe(".env", function() {

	var snmpTargets;
	var snmpParameters;

	it("is valid APP_NAME", function() {
		assert.strictEqual(typeof(process.env.APP_NAME), "string")
	});
	it("is valid LISTEN_ADDRESS", function() {
		assert.match(process.env.LISTEN_ADDRESS, ip4regex)
	});
	it("is valid LISTEN_PORT", function() {

		const port = process.env.LISTEN_PORT;
		assert.ok(0 <port);
		assert.ok(port <65536)
	});
	it("is valid LOGGY_FOLDER", function() {
		assert.strictEqual(fsextra.accessSync(process.env.LOGGY_FOLDER, fsextra.constants.W_OK), undefined)
	});
	it("is valid UPS_NAMES", function() {

		const UPS_NAMES = JSON.parse(process.env.UPS_NAMES);
		assert.ok(Array.isArray(UPS_NAMES));
		snmpTargets = UPS_NAMES.length;
		UPS_NAMES.forEach(name => assert.strictEqual(typeof(name), "string"))
	});
	it("is valid UPS_ADDRESSES", function() {

		const UPS_ADDRESSES = JSON.parse(process.env.UPS_ADDRESSES);
		assert.ok(Array.isArray(UPS_ADDRESSES));
		assert.strictEqual(snmpTargets, UPS_ADDRESSES.length);
		UPS_ADDRESSES.forEach(address => assert.match(address, ip4regex))
	});
	it("is valid UPS_SNMP_POLL_PARAMETERS", function() {

		const UPS_SNMP_POLL_PARAMETERS = JSON.parse(process.env.UPS_SNMP_POLL_PARAMETERS);
		assert.ok(Array.isArray(UPS_SNMP_POLL_PARAMETERS));
		snmpParameters = UPS_SNMP_POLL_PARAMETERS.length;
		UPS_SNMP_POLL_PARAMETERS.forEach(para => assert.strictEqual(typeof(para), "string"))
	});
	it("is valid UPS_SNMP_POLL_NAMES", function() {

		const UPS_SNMP_POLL_NAMES = JSON.parse(process.env.UPS_SNMP_POLL_NAMES);
		assert.ok(Array.isArray(UPS_SNMP_POLL_NAMES));
		assert.strictEqual(snmpParameters, UPS_SNMP_POLL_NAMES.length);
		UPS_SNMP_POLL_NAMES.forEach(name => assert.strictEqual(typeof(name), "string"))
	});
	it("is valid UPS_SNMP_POLL_TIMER", function() {

		const timer = process.env.UPS_SNMP_POLL_TIMER;
		assert.ok(

			(typeof(timer) === "number" && timer - timer === 0)
			||
			(typeof(timer) === "string" && Number.isFinite(+timer) && timer.trim() !== "")
		)
	});
	it("is valid SNMP_COMMUNITY", function() {
		assert.strictEqual(typeof(process.env.SNMP_COMMUNITY), "string")
	});
	it("is valid SNMP_PORT", function() {

		const port = process.env.SNMP_PORT;
		assert.ok(

			(typeof(port) === "number" && port - port === 0)
			||
			(typeof(port) === "string" && Number.isFinite(+port) && port.trim() !== "")
		)
	});
	it("is valid READER_PATHS", function() {

		const readerPaths = JSON.parse(process.env.READER_PATHS);
		assert.ok(Array.isArray(readerPaths));
		readerPaths.forEach(item => assert.ok(isAbsolute(item)))
	})
})







