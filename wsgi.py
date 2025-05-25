import	os
from	typing						import List
from	flask						import Flask
from	flask						import render_template
from	pysnmp.hlapi.v3arch.asyncio	import SnmpEngine
from	pysnmp.hlapi.v3arch.asyncio	import get_cmd
from	pysnmp.hlapi.v3arch.asyncio	import CommunityData
from	pysnmp.hlapi.v3arch.asyncio	import UdpTransportTarget
from	pysnmp.hlapi.v3arch.asyncio	import ContextData
from	pysnmp.hlapi.v3arch.asyncio	import ObjectType
from	pysnmp.hlapi.v3arch.asyncio	import ObjectIdentity








app = Flask(__name__)




@app.route("/get_snmp_eltena")
async def get_snmp_eltena():

	engine = SnmpEngine()
	data = [ "None" ] *6

	errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(

		engine,
		CommunityData("public", mpModel=0),
		await UdpTransportTarget.create(("192.168.160.253", 161)),
		ContextData(),
		ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartInputLineVoltage", 0)),
		ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartInputLineVoltage", 0)),
		ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartBatteryVoltage", 0)),
		ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartOutputLoad", 0)),
		ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartBatteryCapacity", 0)),
		ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartBatteryTemperature", 0)),
		ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartInputFrequency", 0)),
	)

	if errorIndication:	print(errorIndication)
	elif(errorStatus):	print(

		"{} at {}".format(

			errorStatus.prettyPrint(),
			errorIndex and varBinds[int(errorIndex) - 1][0] or "?",
		)
	)
	else:
		data = [ value.prettyPrint() for _,value in varBinds ]


	engine.close_dispatcher()
	return render_template("viewer.html", data=data)




@app.route("/eltena<upd>")
def index(upd): return render_template("index.html", upd=upd)







