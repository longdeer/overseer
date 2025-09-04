







class Normalizer:

	@staticmethod
	def upsSmartInputLineVoltage(value :str)		-> str : return f"{int(value) /10} V"
	@staticmethod
	def upsSmartBatteryVoltage(value :str)			-> str : return f"{int(value) *10} V"
	@staticmethod
	def upsSmartOutputLoad(value :str)				-> str : return f"{value} %"
	@staticmethod
	def upsSmartBatteryCapacity(value :str)			-> str : return f"{value} %"
	@staticmethod
	def upsSmartBatteryTemperature(value :str)		-> str : return f"{int(value) /10} °C"
	@staticmethod
	def upsSmartInputFrequency(value :str)			-> str : return f"{int(value) /10} Hz"
	@staticmethod
	def upsSmartBatteryRunTimeRemaining(value :str)	-> str : return f"{value} sec" if value != "0" else "-"







