const { readdir } = require("fs-extra").promises;
const { accessSync } = require("fs-extra");
const { constants } = require("fs-extra");
const { readFile } = require("fs-extra").promises;
const { statSync } = require("fs-extra");
const { watchFile } = require("fs-extra");
const { createReadStream } = require("fs-extra");
const { createInterface } = require("readline");
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
			.then(description => this.getDirContent(description).then(items => RES(items)).catch(E => REJ(E)))
			.catch(E => REJ(E))
		})
	}
	getDirContent(description) {
		return new Promise((RES,REJ) => {

			try {

				const content = { folders: [], files: [], links: {}};
				description.forEach(item => {

					for(let prop of Object.getOwnPropertySymbols(item))
						if(prop.description === "type") {

							const current = join(item.path, item.name);

							if(item[prop] === 2) content.folders.push([ item.name,current ]); else
							if(item[prop] === 1) {

								content.files.push([ item.name,current ]);
								content.links[current] = this.encodePath(current)

							}	else this.loggy.warn(`Unexpected fs item type ${item[prop]}`)
						}
				});

				RES(content)
			}	catch(E) { REJ(E) }
		})
	}
	fileContent(path) {

		this.loggy.info(`Reading file ${path}`);

		return new Promise(async (RES,REJ) => {

			try {

				const data = await readFile(path,{ encoding: "utf8" });
				this.loggy.info(`Read ${data.length} symbols`);
				RES(data)

			}	catch(E) { this.loggy.warn(E) }
		})
	}
	fileWatch(path, callback) {

		this.loggy.info(`Watching file ${path}`);

		const logger = this.loggy;
		let   fsize = statSync(path).size;
		let   readableStream;
		let   lineReader;

		watchFile(path,{ interval: 1000 },(cs,ps) => {

			if(fsize <cs.size) {

				readableStream = createReadStream(path,{ start: fsize, encoding: "utf8" });
				lineReader = createInterface({ input: readableStream, crlfDelay: Infinity });

				lineReader.on("line",callback);
				lineReader.on("close",() => fsize = cs.size);
				readableStream.on("error",logger.warn);
			}
		})

	}
	encodePath = path => Array.prototype.map.call(path,char => char.codePointAt()).join("-");
	decodePath = link => link.split("-").map(char => String.fromCodePoint(char)).join("");
}








module.exports = Reader;







