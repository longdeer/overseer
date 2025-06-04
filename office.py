from	typing			import Dict
import	mysql.connector	as MYSQL








TAB_CACHE = dict()








async def get_office_tab(name :str) -> Dict[str,str] :

	if	(current := TAB_CACHE.get(name)):

		print(f"cache hit for {name}")
		return current

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


		match name:

			case "actsnprots":
				for row in db: current[row[0]] = {

					"date":		row[1].strftime("%d/%m/%Y"),
					"category":	row[2].decode() if row[2] else row[2],
					"number":	row[3],
					"content":	row[4].decode() if row[4] else row[4],
					"author":	row[5].decode() if row[5] else row[5],
					"comment":	row[6].decode() if row[6] else row[6],
				}


			case "contracts":
				for row in db: current[row[0]] = {

					"date":			row[1].strftime("%d/%m/%Y") if row[1] else row[1],
					"number":		row[2],
					"eosed":		row[3],
					"content":		row[4].decode() if row[4] else row[4],
					"agent":		row[5].decode() if row[5] else row[5],
					"insigner":		row[6].decode() if row[6] else row[6],
					"outsigner":	row[7].decode() if row[7] else row[7],
					"fmdate":		row[8].strftime("%d/%m/%Y") if row[8] else row[8],
					"todate":		row[9].strftime("%d/%m/%Y") if row[9] else row[9],
					"price":		row[10].decode() if row[10] else row[10],
					"comment":		row[11].decode() if row[11] else row[11],
				}


			case "letters":
				for row in db: current[row[0]] = {

					"date":		row[1].strftime("%d/%m/%Y") if row[1] else row[1],
					"number":	row[2],
					"eosed":	row[3],
					"theme":	row[4].decode() if row[4] else row[4],
					"receiver":	row[5].decode() if row[5] else row[5],
					"address":	row[6].decode() if row[6] else row[6],
					"signer":	row[7].decode() if row[7] else row[7],
					"author":	row[8].decode() if row[8] else row[8],
					"comment":	row[9].decode() if row[9] else row[9],
				}


			case "notes":
				for row in db: current[row[0]] = {

					"date":		row[1].strftime("%d/%m/%Y") if row[1] else row[1],
					"reg":		row[2].strftime("%d/%m/%Y") if row[2] else row[2],
					"number":	row[3],
					"eosed":	row[4],
					"theme":	row[5].decode() if row[5] else row[5],
					"receiver":	row[6].decode() if row[6] else row[6],
					"signer":	row[7].decode() if row[7] else row[7],
					"author":	row[8].decode() if row[8] else row[8],
					"comment":	row[9].decode() if row[9] else row[9],
				}


			case _:	current = dict()


		db.close()


		if current : TAB_CACHE[name] = current
		return current


	except	Exception as E:

		print(f"{E.__class__.__name__}: {E}")
		return dict()

	else:	connection.close()







