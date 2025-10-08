const { readdir } = require("fs-extra").promises;
const { accessSync } = require("fs-extra");
const { constants } = require("fs-extra");
const { basename } = require("path");
const { join } = require("path");








class Reader {
	constructor(paths /* Array */, loggy) {

		this.roots = [];
		this.loggy = loggy;

		if(Array.isArray(paths)) {

			this.roots = paths.filter(path => {

				try		{ return !accessSync(path, constants.R_OK) }
				catch(E){ return false }

			}).map(path => [ basename(path),path ]);

			this.loggy.info(`Rader got ${this.roots.length} root folders`)
		}	else this.loggy.warn("Reader constructor root paths must be an array")
	}
	getDir(path) {
		return new Promise((RES,REJ) => {

			readdir(path,{ withFileTypes: true })
			.then(description => this.getContent(description).then(items => RES(items)).catch(E => REJ(E)))
			.catch(E => REJ(E))
		})
	}
	getContent(description) {
		return new Promise((RES,REJ) => {

			try {

				const content = { folders: [], files: []};
				description.forEach(item => {

					for(let prop of Object.getOwnPropertySymbols(item))
						if(prop.description === "type")

							if(item[prop] === 1) content.files.push([ item.name, join(item.path, item.name) ]); else
							if(item[prop] === 2) content.folders.push([ item.name, join(item.path, item.name) ]); else
							this.loggy.warn(`Unexpected fs item type ${item[prop]}`)
				});

				RES(content)
			}	catch(E) { REJ(E) }
		})
	}
}








module.exports = Reader;







