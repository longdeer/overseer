







function openTab(event /* Event */, tabName /* String */, order /* Number */) {

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


	var params = new URLSearchParams();
	params.append("order", order);


	fetch(`/office-tab-${tabName}?${params}`, { "method": "GET" })
		.then(response => {

			if(!response.ok) throw new Error(`Get office tab status: ${response.status}`);
			return response.json();

		}).then(view => {

			var newRow;
			var tab = Object.values(view[tabName]);
			var table = document.getElementById(tabName).getElementsByTagName("table")[0];
			var current = table.getElementsByTagName("tbody")[0];

			if(current) current.remove();

			table =	table.appendChild(document.createElement("tbody"));

			for(var rowID in Object.getOwnPropertyNames(tab)) {

				newRow = table.insertRow();
				row = tab[rowID];
				console.log(`rowId = ${rowID}, row = ${row}`);

				for(var col in row) newRow.insertCell().appendChild(document.createTextNode(row[col]));
			}
		})
}








function sortToggle(event /* Event */, row /* Number */, tabName /* String */) {

	var nextState = event.target.innerHTML.trim().charCodeAt(0) ^2;
	// console.log(`nextState = ${nextState}`);
	// console.log(`nextState &2 = ${nextState &2}`);
	// console.log(`row = ${row}, order = ${(row <<1) + Boolean(nextState &2)}`);
	event.target.innerHTML = `&#${nextState}`;
	openTab(event, tabName, (row <<1) + Boolean(nextState &2));

}







