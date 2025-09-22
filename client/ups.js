







function upsView() {

	const monitor = document.getElementsByClassName("monitor")[0];

	fetch("/ups-monitor-setup")
	.then(response => {

		if(response.status !== 200) console.error(`setup fetch status: ${response.status}`);
		else response.json().then(data => {

			const view = {};
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

				view[v] = {};

				monitorView = document.createElement("div");
				monitorView.className = "monitor-view";

				viewName = document.createElement("h1");
				viewName.className = "view-name-data";
				viewName.innerText = v;
				monitorView.appendChild(viewName);

				monitorView.appendChild(document.createElement("br"));

				viewContent = document.createElement("div");
				viewContent.className = "monitor-content";

				viewTable = document.createElement("table");
				viewTable.className = "monitor-table";
				nameRow = viewTable.insertRow();
				valueRow = viewTable.insertRow();

				pollNames.forEach((name,i) => {

					nameCell = nameRow.insertCell();
					nameCell.className = "view-content-data";
					nameCell.innerText = name;

					valueCell = valueRow.insertCell();
					valueCell.className = "view-content-data";
					valueCell.innerText = "";

					view[v][parameters[i]] = valueCell;
				})
				viewContent.appendChild(viewTable);
				monitorView.appendChild(viewContent);
				monitor.appendChild(monitorView);
			})

			// Object.values(targets).forEach(v => {

			// 	view[v] = {};
			// 	Object.keys(measure).forEach(k => view[v][k] = "")
			// });
			const ws = new WebSocket(`ws://${location.host}/ups-monitor-wscast`);
			ws.onmessage = event => {

				// console.log(event);
				// console.log(event.data);
				// console.log(Object.keys(event.data));
				// console.log(Object.values(event.data));

				const data = JSON.parse(event.data);
				Object.keys(data).forEach(ip => {

					const name = targets[ip];
					Object.keys(data[ip]).forEach(measure => view[name][measure].innerText = data[ip][measure])
				})
			}

		})
	})
}







