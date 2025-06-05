from	typing			import Dict
from	math			import log
from	operator		import itemgetter
import	mysql.connector	as MYSQL








ORDER_CACHE	= dict()
TAB_CACHE	= dict()








async def get_office_tab(name :str, order :int) -> Dict[str,str] :

	if	(current := TAB_CACHE.get(name)):
		if	order == ORDER_CACHE.get(name):

			print(f"cache full hit for {name}")
			return current

		# else:


	try:

		current = dict()
		connection = MYSQL.connect(

			user="vla",
			password="vla::SQL",
			host="192.168.162.65",
			database="office",
		)
		db = connection.cursor()
		db.execute("SELECT * FROM %s"%name)


		is_reversed	= not int(order) &1
		order_col	= int(log(int(order) >>1,2)) +1
		print(f"{is_reversed = }")
		print(f"{order_col = }")


		match name:

			case "actsnprots":
				for col in sorted(

					[[ C if C else "" for C in R ] for R in db ],
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					print(f"{col[0] = }")
					current[col[0]] = {

						"date":		col[1].strftime("%d/%m/%Y"),
						"category":	col[2].decode() if col[2] else col[2],
						"number":	col[3],
						"content":	col[4].decode() if col[4] else col[4],
						"author":	col[5].decode() if col[5] else col[5],
						"comment":	col[6].decode() if col[6] else col[6],
					}


			case "contracts":
				for col in sorted(

					[[ C if C else "" for C in R ] for R in db ],
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					current[col[0]] = {

						"date":			col[1].strftime("%d/%m/%Y") if col[1] else col[1],
						"number":		col[2],
						"eosed":		col[3],
						"content":		col[4].decode() if col[4] else col[4],
						"agent":		col[5].decode() if col[5] else col[5],
						"insigner":		col[6].decode() if col[6] else col[6],
						"outsigner":	col[7].decode() if col[7] else col[7],
						"fmdate":		col[8].strftime("%d/%m/%Y") if col[8] else col[8],
						"todate":		col[9].strftime("%d/%m/%Y") if col[9] else col[9],
						"price":		col[10].decode() if col[10] else col[10],
						"comment":		col[11].decode() if col[11] else col[11],
					}


			case "letters":
				for col in sorted(

					[[ C if C else "" for C in R ] for R in db ],
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					current[col[0]] = {

						"date":		col[1].strftime("%d/%m/%Y") if col[1] else col[1],
						"number":	col[2],
						"eosed":	col[3],
						"theme":	col[4].decode() if col[4] else col[4],
						"receiver":	col[5].decode() if col[5] else col[5],
						"address":	col[6].decode() if col[6] else col[6],
						"signer":	col[7].decode() if col[7] else col[7],
						"author":	col[8].decode() if col[8] else col[8],
						"comment":	col[9].decode() if col[9] else col[9],
					}


			case "notes":
				for col in sorted(

					[[ C if C else "" for C in R ] for R in db ],
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					current[col[0]] = {

						"date":		col[1].strftime("%d/%m/%Y") if col[1] else col[1],
						"reg":		col[2].strftime("%d/%m/%Y") if col[2] else col[2],
						"number":	col[3],
						"eosed":	col[4],
						"theme":	col[5].decode() if col[5] else col[5],
						"receiver":	col[6].decode() if col[6] else col[6],
						"signer":	col[7].decode() if col[7] else col[7],
						"author":	col[8].decode() if col[8] else col[8],
						"comment":	col[9].decode() if col[9] else col[9],
					}


			case _:	current = dict()


		db.close()


		if current : TAB_CACHE[name] = current
		return current


	except	Exception as E:

		print(f"{E.__class__.__name__}: {E}")
		return dict()

	else:	connection.close()








if	__name__ == "__main__":

	import asyncio

	async def check():
		data = await get_office_tab("actsnprots")
		for col in data : print(col)
		for col in data : print(data[col])

	asyncio.run(check())







