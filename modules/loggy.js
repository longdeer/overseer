const { createLogger } = require("winston");
const { File } = require("winston").transports;
const { timestamp } = require("winston").format;
const { combine } = require("winston").format;
const { printf } = require("winston").format;
const fsextra = require("fs-extra");
const fspath = require("path");








module.exports.getRotatedLoggy = function getRotatedLoggy(loggerFolder, loggerName) {

	const point = new Date();
	const T = point.valueOf();
	const Y = String(point.getFullYear());
	const m = String(point.getMonth() +1).padStart(2,"0");
	const d = String(point.getDate()).padStart(2,"0");

	const currentFolder = fspath.join(loggerFolder, Y, m);
	const currentFile = fspath.join(currentFolder, `${d}${loggerName}.loggy`);

	fsextra.ensureDirSync(currentFolder);
	const loggy = createLogger({

		format: combine(

			timestamp({ format: "DD/MM/YYYY HHmm" }),
			printf(({ level, message, timestamp }) => `${timestamp} @${loggerName.toLowerCase()} ${level.toUpperCase()} : ${message}`)
		),
		transports: [ new File({ filename: currentFile }) ]
	})

	point.setHours(0);
	point.setMinutes(0);
	point.setSeconds(0);
	point.setMilliseconds(0);
	point.setDate(point.getDate() +1)

	setTimeout(rotate, point -T, loggy, loggerFolder, loggerName);

	function rotate(loggerObject, loggerFolder, loggerName) {

		const point = new Date();
		const T = point.valueOf();
		const Y = String(point.getFullYear());
		const m = String(point.getMonth() +1).padStart(2,"0");
		const d = String(point.getDate()).padStart(2,"0");

		const currentFolder = fspath.join(loggerFolder, Y, m);
		const currentFile = fspath.join(currentFolder, `${d}${loggerName}.loggy`);

		point.setHours(0);
		point.setMinutes(0);
		point.setSeconds(0);
		point.setMilliseconds(0);
		point.setDate(point.getDate() +1)

		fsextra.ensureDir(currentFolder,() => {

			loggerObject.clear();
			loggerObject.add(new File({ filename: currentFile }));

			setTimeout(rotate, point -T, loggerObject, loggerFolder, loggerName)
		})
	}
	return	loggy
}







