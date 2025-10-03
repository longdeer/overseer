const { readdir } = require("fs-extra").promises;
const { join } = require("path");








class Reader {
	constructor(paths /* Array */) {

		this.roots = paths
	}
	getDir(path) {
		return new Promise((RES,REJ) => {

			readdir(path,{ withFileTypes: true })
			.then(content => this.getContent(content).then(files => RES(files)).catch(E => REJ(E)))
			.catch(E => REJ(E))
		})
	}
	getContent(content) {
		return new Promise((RES,REJ) => {

			try { RES(content.filter(item => {

				for(let prop of Object.getOwnPropertySymbols(item))

					if(prop.description === "type" && item[prop] === 1) return true;
				return false

				}).map(item => join(item.path, item.name)).sort()

			)}	catch(E) { REJ(E) }
		})
	}
}








module.exports = Reader







