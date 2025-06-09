







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


	fetch(`/office-tab-${tabName}?${params}`, { method: "GET" })
		.then(response => {

			if(!response.ok) throw new Error(`Get office tab status: ${response.status}`);
			return response.json();

		}).then(view => {

			var row;
			var col;
			var newRow;
			var tab = view[tabName];
			var table = document.getElementById(tabName).getElementsByTagName("table")[0];
			var current = table.getElementsByTagName("tbody")[0];

			if(current) current.remove();

			table =	table.appendChild(document.createElement("tbody"));
			tab.forEach(row => {

				newRow = table.insertRow();
				for(col in row) newRow.insertCell().appendChild(document.createTextNode(row[col]));
			})
		})
}








function sortToggle(event /* Event */, row /* Number */, tabName /* String */) {

	var nextState = event.target.innerHTML.trim().charCodeAt(0) ^2;
	event.target.innerHTML = `&#${nextState}`;
	openTab(event, tabName, (row <<1) + Boolean(nextState &2));

}








function adaptInputs() {

	document.querySelectorAll("input").forEach(node => {
		node.addEventListener("input", () => {

			node.style.width = "146px";
			node.style.width = node.scrollWidth + "px";
		})
	})
}








function submitTabInput(Tab) {

	var tabName = Tab.id.split("-").slice(-1);
	var query = {};
	query[tabName] = {};

	Array.prototype.forEach.call(Tab,item => { if(item.name !== "submit") query[tabName][item.name] = item.value })

	fetch("/office-add",{ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) })
		.then(response => {

			if(!response.ok) throw new Error(`Get office tab add status: ${response.status}`);
			return response.json();

		}).then(response => console.log("ok"))
}







