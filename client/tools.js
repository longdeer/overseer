







export function heartbit(socket, timeout) {

	/*
	 *	Makes websocket "socket" ping to server
	 *	to asure connection will be kept alive.
	 *	By default "timeout" timer is 3600000
	 *	(one hour).
	 */

	setTimeout(() => {

		socket.send("heartbit");
		heartbit(socket, timeout)

	},	timeout || 3600000)
}
export function fader(R, G, B, block) {

	/*
	 *	Makes a "block" element background
	 *	to become white in a slightly fast
	 *	period of time (100 ms per tick).
	 */

	++R; ++G; ++B;
	block.style.backgroundColor = `rgb(${R},${G},${B})`;
	if(R !== 255 && G !== 255 && B !== 255) setTimeout(() => fader(R, G, B, block),100);
}







