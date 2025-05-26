from pysnmp.hlapi.v3arch.asyncio import SnmpEngine
from pysnmp.hlapi.v3arch.asyncio import get_cmd
from pysnmp.hlapi.v3arch.asyncio import CommunityData
from pysnmp.hlapi.v3arch.asyncio import UdpTransportTarget
from pysnmp.hlapi.v3arch.asyncio import ContextData
from pysnmp.hlapi.v3arch.asyncio import ObjectType
from pysnmp.hlapi.v3arch.asyncio import ObjectIdentity








async def get_eltena(addr :str):

	engine = SnmpEngine()
	data = [ "None" ] *6

	errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(

		engine,
		CommunityData("public", mpModel=0),
		await UdpTransportTarget.create((addr, 161)),
		ContextData(),
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
	else:	data = [ value.prettyPrint() for _,value in varBinds ]


	engine.close_dispatcher()
	return	data







