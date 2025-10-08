







function initReader() {

	const reader = document.getElementsByClassName("reader-view")[0];
	const ws = new WebSocket(`ws://${location.host}/reader-wscast`);
	const structure = new Map();
	const links = new Map();

	ws.addEventListener("message",event => {

		const data = JSON.parse(event.data);

		if(data.roots) {

			data.roots.forEach(([ name,path ]) => {

				const root = document.createElement("button");
				root.innerText = name;
				root.className = "reader-folder-item";
				root.addEventListener("click",event => {

					event.preventDefault();
					if(structure.has(event.target)) expandCollapse(structure, event.target);
					else {

						structure.set(event.target,[]);
						ws.send(JSON.stringify({ parent: path, indent: 1 }))
					}
				});
				links.set(path, root);
				reader.appendChild(root)
			});

		}	else if(data.parent && data.children && data.indent) {

			const parent = links.get(data.parent);
			const indent = data.indent;

			data.children.folders.forEach(([ name,path ]) => {

				const child = document.createElement("button");
				child.innerText = `└ ${name}`;
				child.className = "reader-folder-item";
				child.style.marginLeft = `${indent*30}px`;
				child.addEventListener("click",event => {

					event.preventDefault();
					if(structure.has(event.target)) expandCollapse(structure, event.target);
					else {

						structure.set(event.target,[]);
						ws.send(JSON.stringify({ parent: path, indent: indent +1 }))
					}
				});
				parent.after(child);
				links.set(path, child);
				structure.get(parent).push(child)
			});
			data.children.files.forEach(([ name,path ]) => {

				const child = document.createElement("button");
				child.innerText = `└ ${name}`;
				child.className = "reader-file-item";
				child.style.marginLeft = `${indent*30}px`;
				child.addEventListener("click",event => {

					console.log(`openning ${path}`)
				});
				parent.after(child);
				links.set(path, child);
				structure.get(parent).push(child)
			})

		}	else console.error("Improper data")
	})
}
function expandCollapse(mapper, target, mode) {
	mapper.get(target).forEach(item => {

		if(item.style.display === "none" && mode === 1) return;
		if(item.style.display === "none") item.style.display = "block";
		else {

			item.style.display = "none";
			if(mapper.has(item)) expandCollapse(mapper, item, 1)
		}
	})
}







