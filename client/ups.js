







function upsView() {

	const monitor = document.getElementById("monitor");

	fetch("/ups-monitor-setup")
	.then(response => {

		if(response.status !== 200) console.error(`setup fetch status: ${response.status}`);
		else response.json().then(data => {

			const views = {};
			const stats = {};
			const updates = {};
			const timer = data.timer *2;
			const targets = data.targets;
			const parameters = data.parameters;
			const descriptions = data.descriptions;

			let monitorView;
			let viewName;
			let viewContent;
			let viewTable;
			let nameRow;
			let valueRow;
			let nameCell;
			let valueCell;

			Object.values(targets).forEach(v => {

				stats[v] = {};

				monitorView = document.createElement("div");
				viewName = document.createElement("h1");
				viewContent = document.createElement("div");
				viewTable = document.createElement("table");

				viewContent.className = "monitor-content";
				monitorView.className = "monitor-view";
				viewTable.className = "monitor-table";
				viewName.className = "view-name-data";
				viewName.innerText = v;

				nameRow = viewTable.insertRow();
				valueRow = viewTable.insertRow();

				descriptions.forEach((name,i) => {

					nameCell = nameRow.insertCell();
					valueCell = valueRow.insertCell();

					nameCell.className = "view-content-data";
					valueCell.className = "view-content-data";

					nameCell.innerText = name;
					valueCell.innerText = "";

					stats[v][parameters[i]] = valueCell;
				});

				monitorView.appendChild(viewName);
				monitorView.appendChild(document.createElement("br"));
				viewContent.appendChild(viewTable);
				monitorView.appendChild(viewContent);
				monitor.appendChild(monitorView);

				views[v] = monitorView
			})

			const ws = new WebSocket(`ws://${location.host}/ups-monitor-wscast`);
			ws.addEventListener("message",event => {

				const message = JSON.parse(event.data);
				Object.keys(message).forEach(ip => {

					const name = targets[ip];
					const data = message[ip];
					const stat = Object.keys(data);

					if(stat.length) {

						views[name].style.backgroundColor = "white";
						updates[name] = new Date();
						stat.forEach(unit => {

							stats[name][unit].innerText = data[unit];
							if(unit === "upsSmartBatteryRunTimeRemaining" && data[unit] !== "-")

								views[name].style.backgroundColor = "red"
						})
					}	else	views[name].style.backgroundColor = "yellow"
				})
			});	setTimeout(() => Object.keys(updates).forEach(name => markDead(name, updates, views, timer)), timer)
		})
	})
	.catch(E => console.error(E))
}
function markDead(name, schedule, container, timer) {

	if(timer <new Date() - schedule[name]) container[name].style.backgroundColor = "yellow";
	else setTimeout(markDead, timer, name, schedule, container, timer)
}







