







function initReader() {

	const reader = document.getElementsByClassName("reader-view")[0];
	const treeMap = new Map();
	const expanded = new Map();
	// let   messageBlock;


	// fetch("/reader-setup")
	// .then(response => {

	// 	if(response.status !== 200) console.error(`setup fetch status: ${response.status}`);
	// 	else response.json().then(data => {

	// 		// data.forEach(message => {

	// 		// 	messageBlock = document.createElement("pre");
	// 		// 	messageBlock.className = "announcer-message";
	// 		// 	messageBlock.innerText = message;
	// 		// 	announcer.appendChild(messageBlock)
	// 		// });	announcer.scrollIntoView(false);//window.scrollTo(0, document.body.scrollHeight)

	// 		console.log(data)
	// 	})
	// })
	// .catch(E => console.error(E));


	const ws = new WebSocket(`ws://${location.host}/reader-wscast`);
	// ws.addEventListener("open",event => console.log(event));
	ws.addEventListener("message",event => {

		const data = JSON.parse(event.data);
		if(data.roots) {

			console.log(data.roots);
			const rootList = document.createElement("ul");
			data.roots.forEach(path => {

				const root = document.createElement("li");
				root.innerText = path;
				root.className = "reader-folder-item";
				root.addEventListener("click",event => {
					console.log(event.target)

					event.preventDefault();
					if(expanded.has(event.target)) {

						// expanded.set(event.target, !expanded.get(event.target));
						// event.target.style.display = expanded.get(event.target) ? "grid" : "none"
						console.log(`in roots ${event.target.children}`)

					}	else {

						expanded.set(event.target, true);
						ws.send(event.target.innerText)
					}
				});

				rootList.appendChild(root);
				treeMap.set(path, root)
			});

			reader.appendChild(rootList)

		}	else if(data.parent && data.children) {

			const list = document.createElement("ul");
			const parent = data.parent;
			console.log(`parent = ${parent}`);
			console.log(`children = ${data.children}`);

			data.children.folders.forEach(path => {

				const child = document.createElement("li");
				child.innerText = path;
				child.className = "reader-folder-item";
				child.addEventListener("click",event => {

					event.preventDefault();
					if(expanded.has(event.target)) {

						// expanded.set(event.target, !expanded.get(event.target));
						// event.target.style.display = expanded.get(event.target) ? "grid" : "none"
						console.log(`if folders ${event.target.children}`)

					}	else {

						expanded.set(event.target, true);
						ws.send(event.target.innerText)
					}
				});

				list.appendChild(child);
				treeMap.set(path, child)
			});
			data.children.files.forEach(path => {

				const child = document.createElement("li");
				child.innerText = path;
				child.className = "reader-file-item";
				child.addEventListener("click",event => {

					event.preventDefault();
					if(expanded.has(event.target)) {

						// expanded.set(event.target, !expanded.get(event.target));
						// event.target.style.display = expanded.get(event.target) ? "grid" : "none"
						console.log(`in files ${event.target.children}`)

					}	else {

						expanded.set(event.target, true);
						ws.send(event.target.innerText)
					}
				});

				list.appendChild(child);
				treeMap.set(path, child)
			});

			treeMap.get(parent).appendChild(list)

		}	else console.error("Improper data")
	});
	// ws.onmessage = event => {

	// 	messageBlock = document.createElement("pre");
	// 	messageBlock.className = "announcer-message";
	// 	messageBlock.innerText = event.data;

	// 	(function fader(R, G, B, block) {

	// 		++R; ++G; ++B;
	// 		block.style.backgroundColor = `rgb(${R},${G},${B})`;
	// 		if(R !== 255 && G !== 255 && B !== 255) setTimeout(() => fader(R, G, B, block),100);

	// 	})(216, 216, 216, messageBlock);

	// 	announcer.appendChild(messageBlock);
	// 	announcer.scrollIntoView(false)
	// }
}
// function toggle() {

// 	return
// }







