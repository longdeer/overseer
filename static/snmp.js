var updateView = function() {

	fetch("/get_snmp_eltena", { "method": "GET" })
		.then(response => response.text())
		.then(view => console.log(view))
		// .then(view => document.getElementById("viewer").innerHTML = view)
}