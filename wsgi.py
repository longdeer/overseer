import	os
from	typing						import List
from	time						import sleep
from	flask						import Flask
from	flask						import render_template
from	pysnmp.hlapi.v3arch.asyncio	import SnmpEngine
from	pysnmp.hlapi.v3arch.asyncio	import get_cmd
from	pysnmp.hlapi.v3arch.asyncio	import CommunityData
from	pysnmp.hlapi.v3arch.asyncio	import UdpTransportTarget
from	pysnmp.hlapi.v3arch.asyncio	import ContextData
from	pysnmp.hlapi.v3arch.asyncio	import ObjectType
from	pysnmp.hlapi.v3arch.asyncio	import ObjectIdentity
from	pysnmp.smi					import builder








# mib_builder = builder.MibBuilder()
# mib_sources = mib_builder.get_mib_sources() + ( builder.DirMibSource(os.path.join(os.getcwd(),"snmp")), )
# mib_builder.set_mib_sources(*mib_sources)
# mib_builder.load_modules("XPPC-MIB")








async def eltena3kcc() -> List[str] :

	engine = SnmpEngine()
	# mib_builder = engine.get_mib_builder()
	# mib_builder.add_mib_sources(builder.DirMibSource())
	# mib_builder.set_mib_sources(mib_builder.get_mib_sources() + ( builder.DirMibSource(os.path.join(os.getcwd(),"snmp")), ))
	# engine.get_mib_builder().set_mib_sources(*mib_sources)
	# engine.get_mib_builder().load_modules("XPPC-MIB")
	# mib_builder = builder.MibBuilder()
	# mib_builder.load_modules("XPPC-MIB")
	result = [ "None" ] *6

	errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(

		engine,
		CommunityData("public", mpModel=0),
		await UdpTransportTarget.create(("192.168.160.253", 161)),
		ContextData(),
		# ObjectType(ObjectIdentity("XPPC-MIB", "upsSmartInputLineVoltage", 0)).loadMibs("XPPC-MIB"),
		ObjectType(ObjectIdentity(

			"XPPC-MIB", "upsSmartInputLineVoltage", 0)

		).addMibSource(os.path.join(os.getcwd(),"snmp")),
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
		result = [ value.prettyPrint() for _,value in varBinds ]


	engine.close_dispatcher()
	return result








app = Flask(__name__)


@app.route("/eltena_fetcher")
async def fetcher():

	data = await eltena3kcc()
	return render_template(

		"viewer.html",
		# headers=[

		# 	"Input Voltage",
		# 	"Battery Voltage",
		# 	"Output load",
		# 	"Capacity",
		# 	"Temperature",
		# 	"Input frequency",
		# ],
		data=data
	)


@app.route("/eltena<upd>")
def index(upd): return render_template("index.html", upd=upd)







