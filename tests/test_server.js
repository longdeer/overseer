const assert = require("assert");
const mock = require("node:test").mock;
const request = require("supertest");
const server = require("../modules/server.js");








describe("server", function() {

	const logger = { info() {}, warn() {}};
	const options = {

		snmp: {

			poller: null,
			targets: {},
			pollTimer: 0,
			parameters: [],
			secriptions: []
		}
	}
	mock.method(logger, "info");
	mock.method(logger, "warn");

	describe("GET routes", function() {
		it("GET /client/ups.js", function(done) {

			request(new server(options, logger).server)
			.get("/client/ups.js")
			.expect("Content-Type", "text/javascript")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),1);

				return done()
			})
		});
		it("GET /client/reader.js", function(done) {

			request(new server(options, logger).server)
			.get("/client/reader.js")
			.expect("Content-Type", "text/javascript")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),2);

				return done()
			})
		});
		it("GET /client/announcer.js", function(done) {

			request(new server(options, logger).server)
			.get("/client/announcer.js")
			.expect("Content-Type", "text/javascript")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),3);

				return done()
			})
		});
		it("GET /client/tools.js", function(done) {

			request(new server(options, logger).server)
			.get("/client/tools.js")
			.expect("Content-Type", "text/javascript")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),4);

				return done()
			})
		});
		it("GET /client/styles.css", function(done) {

			request(new server(options, logger).server)
			.get("/client/styles.css")
			.expect("Content-Type", "text/css")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),5);

				return done()
			})
		});
		it("GET /", function(done) {

			request(new server(options, logger).server)
			.get("/")
			.expect("Content-Type", "text/html")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),6);

				return done()
			})
		});
		it("GET /ups-monitor", function(done) {

			request(new server(options, logger).server)
			.get("/ups-monitor")
			.expect("Content-Type", "text/html")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),7);

				return done()
			})
		});
		it("GET /reader", function(done) {

			request(new server(options, logger).server)
			.get("/reader")
			.expect("Content-Type", "text/html")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),8);

				return done()
			})
		});
		it("GET /announcer", function(done) {

			request(new server(options, logger).server)
			.get("/announcer")
			.expect("Content-Type", "text/html")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),9);

				return done()
			})
		});
		it("GET /ups-monitor-setup", function(done) {

			request(new server(options, logger).server)
			.get("/ups-monitor-setup")
			.expect("Content-Type", "application/json")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),10);

				return done()
			})
		});
		it("GET /announcer-setup", function(done) {

			request(new server(options, logger).server)
			.get("/announcer-setup")
			.expect("Content-Type", "application/json")
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),0);
				assert.strictEqual(logger.info.mock.callCount(),11);

				return done()
			})
		});
		it("GET non-existent page", function(done) {

			request(new server(options, logger).server)
			.get("/non-existent-page")
			.expect(404)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),1);
				assert.strictEqual(logger.info.mock.callCount(),12);

				return done()
			})
		})
	});
	describe("POST routes", function() {
		it("POST /announcer-receiver", function(done) {

			const session = new server(options, logger);

			request(session.server)
			.post("/announcer-receiver")
			.send({ message: "howdy"})
			.expect(200)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),1);
				assert.strictEqual(logger.info.mock.callCount(),14);
				assert.strictEqual(session.announcerHistory.length, 1);

				return done()
			})
		});
		it("POST non-existent page", function(done) {

			request(new server(options, logger).server)
			.post("/non-existent-page")
			.send({ message: "howdy"})
			.expect(404)
			.end((err,res) => {

				if(err) return done(err);

				assert.strictEqual(logger.warn.mock.callCount(),2);
				assert.strictEqual(logger.info.mock.callCount(),15);

				return done()
			})
		})
	})
})







