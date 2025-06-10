







function openTab(event /* Event */, tabName /* String */, order /* Number */, fromTab /* Boolean */) {

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

	fetchTabData(tabName, order, fromTab);
}








function fetchTabData(tabName /* String */, order /* Number */, fromTab /* Boolean */) {

	fetch(`/office-tab-${tabName}?${new URLSearchParams({ order, fromTab })}`, { method: "GET" })
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
	fetchTabData(tabName, (row <<1) + Boolean(nextState &2), false);
}








function adaptInputs() {

	document.querySelectorAll("input").forEach(node => {
		node.addEventListener("input", event => {

			event.preventDefault();
			node.style.width = "146px";
			node.style.backgroundColor = "white";
			node.style.width = node.scrollWidth + "px";
		})
	})
}








function submitTabInput(Tab) {

	var tabName = Tab.id.split("-").slice(-1);
	var query = {};
	query[tabName] = {};

	Array.prototype.forEach.call(Tab,item => { if(item.name !== "submit") query[tabName][item.name] = item.value });

	fetch("/office-add",{ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) })
		.then(response => {

			switch(response.status) {

				case 200:

					Array.prototype.forEach.call(Tab,item => { if(item.name !== "submit") item.value = "" });
					fetchTabData(tabName, 3, true);
					break;

				case 400:

					response.json().then(data => {

						for(var field in data)
							if(field !== "success")
								Tab.elements[field].style.backgroundColor = "red";
					});
					break;

				/*
					Despite endpoint might return 405, no need for handling it,
					cause it's only for other than POST method
				*/

				case 500:

					response.json().then(data => alert(data.exception));
					break;
			}
		})
}







