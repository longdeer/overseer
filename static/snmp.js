var updateView = function() {

	view = fetch("/get_snmp_eltena", { "method": "GET" })
		.then(response => {

			if(!response.ok) throw new Error(`Get SNMP status: ${response.status}`);
			return response.json();

		}).then(view => {

			var ccInputACV		= Number(view.CC.input_ACV) /10;
			var ccBatteriesDCV	= Number(view.CC.batteries_DCV) *10;
			var ccLoadPerc		= view.CC.load_perc;
			var ccCapacityPerc	= view.CC.capacity_perc;
			var ccTemperature	= Number(view.CC.temperature) /10;
			var ccFrequency		= Number(view.CC.frequency) /10;
			var ccTimeRemain	= Number(view.CC.time_remain) || "-";

			var rxInputACV		= Number(view.Rx.input_ACV) /10;
			var rxBatteriesDCV	= Number(view.Rx.batteries_DCV) *10;
			var rxLoadPerc		= view.Rx.load_perc;
			var rxCapacityPerc	= view.Rx.capacity_perc;
			var rxTemperature	= Number(view.Rx.temperature) /10;
			var rxFrequency		= Number(view.Rx.frequency) /10;
			var rxTimeRemain	= Number(view.Rx.time_remain) || "-";


			document.getElementsByClassName("snmp-view cc")[0].style.backgroundColor = ccTimeRemain === "-" ?
				"white" : "red";
			document.getElementsByClassName("snmp-view rx")[0].style.backgroundColor = rxTimeRemain === "-" ?
				"white" : "red";


			document.getElementById("cc-inputACV").innerHTML = `${ccInputACV} V`;
			document.getElementById("cc-batteriesDCV").innerHTML = `${ccBatteriesDCV} V`;
			document.getElementById("cc-loadPerc").innerHTML = `${ccLoadPerc} %`;
			document.getElementById("cc-capacityPerc").innerHTML = `${ccCapacityPerc} %`;
			document.getElementById("cc-temperature").innerHTML = `${ccTemperature} C`;
			document.getElementById("cc-frequency").innerHTML = `${ccFrequency} Hz`;
			document.getElementById("cc-timeRemain").innerHTML = ccTimeRemain;

			document.getElementById("rx-inputACV").innerHTML = `${rxInputACV} V`;
			document.getElementById("rx-batteriesDCV").innerHTML = `${rxBatteriesDCV} V`;
			document.getElementById("rx-loadPerc").innerHTML = `${rxLoadPerc} %`;
			document.getElementById("rx-capacityPerc").innerHTML = `${rxCapacityPerc} %`;
			document.getElementById("rx-temperature").innerHTML = `${rxTemperature} C`;
			document.getElementById("rx-frequency").innerHTML = `${rxFrequency} Hz`;
			document.getElementById("rx-timeRemain").innerHTML = rxTimeRemain;
		})
}