







class OverseerView {

	constructor(tableNames /* [ String, ] */, pollTimer /* Number */) {

		this.views = {};
		tableNames.forEach(name => this.views[name] = document.getElementsByClassName(`monitor-table ${name}`)[0]);

		this.getStatus(this.views);
		setInterval(() => this.getStatus(this.views), pollTimer)
	}
	getStatus(targets) {

		fetch("/ups-status",{ method: "GET" })
			.then(response => {

				if(!response.ok) throw new Error(`UPS status: ${response.status}`);
				return response.json();

			}).then(data => {

				let view;
				let table;
				let battery;
				let para;
				let cell;
				let value;

				for(name in data) {

					view = data[name];
					table = targets[name];

					if(Object.keys(view).length) {
						battery = false;

						for(para in view) {

							cell = table.getElementsByClassName(`view-content-data ${para}`)[0];
							value = view[para];
							cell.innerText = value;

							// Battery running indicator
							if(para === "upsSmartBatteryRunTimeRemaining" && value !== "-") {

								table.style.backgroundColor = "red";
								battery = true
							}
						}	if(!battery) table.style.backgroundColor = "white"
					}
					else	table.style.backgroundColor = "yellow";
				}

			}).catch(E => {

				console.log(E);
				Object.values(targets).forEach(view => view.style.backgroundColor = "yellow")
			})
	}
}







