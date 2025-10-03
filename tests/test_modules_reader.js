const assert = require("assert");
// const mock = require("node:test").mock;
const Reader = require("../modules/reader.js");








describe("Reader", function() {

	const reader = new Reader([ "LOL", "KEK" ]);
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
	it("get content from getContent", async function() {

		const files = await reader.getContent(content);
		assert.deepStrictEqual(files,[ "/srv/content/LOL" ])
	});
	// TODO: get some testing folders/files (it works for real)
	it("get content from getDir", async function() {

		const files = await reader.getDir("ROOT");
		assert.deepStrictEqual(files,[ "ROOT/FILE" ]);
	})
})







