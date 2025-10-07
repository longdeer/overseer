







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
			const rootList = document.createElement("p");
			data.roots.forEach(path => {

				const root = document.createElement("p");
				root.innerText = path;
				root.className = "reader-folder-item";
				root.addEventListener("click",event => {
					console.log(event.target)

					event.preventDefault();
					if(expanded.has(event.target)) {

						// expanded.set(event.target, !expanded.get(event.target));
						// event.target.style.display = expanded.get(event.target) ? "grid" : "none"
						// console.log(`in roots ${event.target.children}`)
						(function collapseItems(target) {
							target.forEach(item => {

								let icSollapsed = item.style.display === "none";
								item.style.display = icSollapsed ? "grid" : "none";
								if(icSollapsed) collapseItems(expanded.get(item))
							})
						})(expanded.get(event.target))

					}	else {

						expanded.set(event.target,[]);
						ws.send(JSON.stringify({ parent: event.target.innerText, indent: 1 }))
					}
				});

				rootList.appendChild(root);
				treeMap.set(path, root)
			});

			reader.appendChild(rootList)

		}	else if(data.parent && data.children && data.indent) {

			// const list = document.createElement("p");
			const parent = treeMap.get(data.parent);
			const indent = data.indent;
			// console.log(`parent = ${parent}`);
			// console.log(`children = ${data.children}`);

			data.children.folders.forEach(path => {

				const child = document.createElement("p");
				child.innerText = path;
				child.className = "reader-folder-item";
				child.style.marginLeft = `${indent*30}px`;
				child.addEventListener("click",event => {

					event.preventDefault();
					if(expanded.has(event.target)) {

						// expanded.set(event.target, !expanded.get(event.target));
						// event.target.style.display = expanded.get(event.target) ? "grid" : "none"
						// console.log(`if folders ${event.target.children}`)
						(function collapseItems(target) {
							target.forEach(item => {

								let icSollapsed = item.style.display === "none";
								item.style.display = icSollapsed ? "grid" : "none";
								if(icSollapsed) collapseItems(expanded.get(item))
							})
						})(expanded.get(event.target))

					}	else {

						expanded.set(event.target,[]);
						ws.send(JSON.stringify({ parent: event.target.innerText, indent: indent +1 }))
						// ws.send(event.target.innerText)
					}
				});
				parent.after(child);
				// list.appendChild(child);
				treeMap.set(path, child);
				expanded.get(parent).push(child)
			});
			data.children.files.forEach(path => {

				const child = document.createElement("p");
				child.innerText = path;
				child.className = "reader-file-item";
				child.style.marginLeft = `${indent*30}px`;
				child.addEventListener("click",event => {

					event.preventDefault();
					if(expanded.has(event.target)) {

						// expanded.set(event.target, !expanded.get(event.target));
						// event.target.style.display = expanded.get(event.target) ? "grid" : "none"
						console.log(`in files ${event.target.children}`)

					}	else {

						expanded.set(event.target,[]);
						ws.send(JSON.stringify({ parent: event.target.innerText, indent: indent +1 }))
						// ws.send(event.target.innerText)
					}
				});

				parent.after(child);
				// list.appendChild(child);
				treeMap.set(path, child)
			});

			// treeMap.get(parent).appendChild(list)

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







