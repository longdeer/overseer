import { heartbit } from "./tools.js";








window.initReader = function() {

	const reader = document.getElementById("reader-view");
	const ws = new WebSocket(`ws://${location.host}/reader-wscast`);
	const structure = new Map();
	const links = new Map();

	ws.addEventListener("open",event => heartbit(ws));
	ws.addEventListener("message",event => {

		const data = JSON.parse(event.data);

		if(data.roots) {

			data.roots.forEach(([ name,path ]) => {

				const root = document.createElement("button");
				root.innerText = name;
				root.className = "button-item";
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
				child.innerText = `${name}`;
				child.className = "button-item";
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
				child.innerText = `${name}`;
				child.className = "reader-file-item";
				child.style.marginLeft = `${indent*30}px`;
				child.addEventListener("click",event => open(`/reader-file-${data.children.links[path]}`));
				parent.after(child);
				links.set(path, child);
				structure.get(parent).push(child)
			})

		}	else console.error("Improper data")
	})
}
window.initView = function() {

	const view = document.getElementsByClassName("file-view")[0];
	const targetSplit = location.href.split("/");
	const target = targetSplit[targetSplit.length-1].slice(12);
	const ws = new WebSocket(`ws://${location.host}/reader-file-wscast`);
	ws.addEventListener("open",event => {

		ws.send(target);
		heartbit(ws)
	});
	ws.addEventListener("message",event => view.innerText += event.data);
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







