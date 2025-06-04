function openTab(event, tabName) {

	Array.prototype.forEach.call(

		document.getElementsByClassName("office-tab-content"),
		E => E.style.display = 'none'
	);
	Array.prototype.forEach.call(

		document.getElementsByClassName("office-tab"),
		E => E.className.replace(" active","")
	);
	document.getElementById(tabName).style.display = "block";
	event.currentTarget.className += " active";


	fetch(`/office-tab-${tabName}`, { "method": "GET" })
		.then(response => {

			if(!response.ok) throw new Error(`Get office tab status: ${response.status}`);
			return response.json();

		}).then(view => {

			var newRow;
			var tab = view[tabName];
			var table = document.getElementById(tabName).getElementsByTagName("table")[0];
			var current = table.getElementsByTagName("tbody")[0];

			if(current) current.remove();

			table =	table.appendChild(document.createElement("tbody"));


			for(var rowID in tab) {

				newRow = table.insertRow();
				row = tab[rowID];

				for(var col in row) newRow.insertCell().appendChild(document.createTextNode(row[col] || ""));
			}
		})
}