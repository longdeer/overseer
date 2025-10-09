const assert = require("assert");
// const mock = require("node:test").mock;
const Reader = require("../modules/reader.js");








describe("Reader", function() {

	const logger = { info() {}, warn() {}};
	const reader = new Reader([ "LOL", "KEK" ],logger);
	const type = Symbol("type");
	const content = [
		{
			name: "LOL",
			parentPath: "/srv/content",
			path: "/srv/content",
			[type]: 1
		},
		{
			name: "KEK",
			parentPath: "/srv/content",
			path: "/srv/content",
			[type]: 2
		}
	];
	it("get content from getDirContent", async function() {

		const items = await reader.getDirContent(content);
		assert.deepStrictEqual(items,{ files:[[ "LOL","/srv/content/LOL" ]], folders: [[ "KEK","/srv/content/KEK" ]]})
	});
	// TODO: get some testing folders/files (it works for real)
	it.skip("get content from getDir", async function() {

		const items = await reader.getDir("ROOT");
		assert.deepStrictEqual(items,[ "ROOT/FILE" ]);
	});
	it("correct endoce-decode", function() {

		const path = "/path/to/very interesting file";
		assert.strictEqual(reader.decodePath(reader.encodePath(path)), path);
	})
})







