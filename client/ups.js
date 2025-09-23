







function upsView() {

	const monitor = document.getElementsByClassName("monitor")[0];

	fetch("/ups-monitor-setup")
	.then(response => {

		if(response.status !== 200) console.error(`setup fetch status: ${response.status}`);
		else response.json().then(data => {

			const views = {};
			const stats = {};
			const updates = {};
			const targets = data.targets;
			const pollNames = data.pollNames;
			const parameters = data.parameters;

			let monitorView;
			let viewName;
			let viewContent;
			let viewTable;
			let nameRow;
			let valueRow;
			let nameCell;
			let valueCell;
			let i;

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

				pollNames.forEach((name,i) => {

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
			ws.onmessage = event => {

				const message = JSON.parse(event.data);
				Object.keys(message).forEach(ip => {

					const name = targets[ip];
					const data = message[ip];
					const stat = Object.keys(data);

					updates[name] = new Date();
					views[name].style.backgroundColor = stat.length ? "white" : "yellow";
					stat.forEach(unit => {

						stats[name][unit].innerText = data[unit];
						if(unit === "upsSmartBatteryRunTimeRemaining" && data[unit] !== "-")
							views[name].style.backgroundColor = "red"
					})
				})
			}
			setInterval(() => {
				Object.keys(updates).forEach(name => {

					if(10000 <new Date() - updates[name])
						views[name].style.backgroundColor = "yellow"
				})
			},	10000)
		})
	})
}







