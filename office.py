from	typing							import	Dict
from	typing							import	List
from	operator						import	itemgetter
from	datetime						import	date
from	math							import	log
from	pygwarts.magical.spells			import	patronus
from	pygwarts.magical.time_turner	import	TimeTurner
import	mysql.connector					as		MYSQL








async def del_office_content(query :Dict[str,Dict[str,str]]) -> str | None :

	if	isinstance(query, dict) and len(query) == 2:

		try:

			connection = MYSQL.connect(

				user="vla",
				password="vla::SQL",
				host="192.168.162.65",
				database="office",
			)
			db = connection.cursor()

			db.execute("DELETE FROM %s WHERE id = %s"%(query["tabName"], query["rowId"]))

			connection.commit()
			db.close()


		except	Exception as E:

			message = patronus(E)
			print(message)
			return message

		else:	connection.close()
	else: 		return "Incorrect query"








async def add_office_content(query :Dict[str,Dict[str,str]]) -> Dict[str,str] | str | None :

	if	isinstance(query, dict) and len(query) == 1:

		try:

			connection = MYSQL.connect(

				user="vla",
				password="vla::SQL",
				host="192.168.162.65",
				database="office",
			)
			db = connection.cursor()
			values = str()
			keys = str()


			for data in query.values():
				for k,v in data.items():

					if	v:
						match k:
							case "date" | "fmdate" | "todate" | "reg":

								try:	point = TimeTurner(v)
								except	ValueError : return { k:v }
								else:	values += f"'{point.Ymd_dashed}',"
							case _:		values += f"'{v}',"

						keys += f"{k},"


			db.execute("INSERT INTO %s (%s) VALUES (%s)"%(list(query)[0], keys.strip(","), values.strip(",")))
			connection.commit()
			db.close()


		except	Exception as E:

			message = patronus(E)
			print(message)
			return message

		else:	connection.close()
	else:		return "Incorrect query"








async def get_office_tab(name :str, order_by :int, descending :bool) -> List[str] :

	try:

		connection = MYSQL.connect(

			user="vla",
			password="vla::SQL",
			host="192.168.162.65",
			database="office",
		)
		db = connection.cursor()
		db.execute("SELECT * FROM %s ORDER BY %s %s"%(name, order_by, "DESC" if descending else "ASC"))


		match name:

			case "actsnprots":
				current = [
					[
						row[0],
						row[1].strftime("%d/%m/%Y") if row[1] else str(),
						row[2].decode() if row[2] else str(),
						row[3] or str(),
						row[4].decode() if row[4] else str(),
						row[5].decode() if row[5] else str(),
						row[6].decode() if row[6] else str()
					]	for row in db
				]


			case "contracts":
				current = [
					[
						row[0],
						row[1].strftime("%d/%m/%Y") if row[1] else str(),
						row[2] or str(),
						row[3] or str(),
						row[4].decode() if row[4] else str(),
						row[5].decode() if row[5] else str(),
						row[6].decode() if row[6] else str(),
						row[7].decode() if row[7] else str(),
						row[8].strftime("%d/%m/%Y") if row[8] else str(),
						row[9].strftime("%d/%m/%Y") if row[9] else str(),
						row[10].decode() if row[10] else str(),
						row[11].decode() if row[11] else str()
					]	for row in db
				]


			case "letters":
				current = [
					[
						row[0],
						row[1].strftime("%d/%m/%Y") if row[1] else str(),
						row[2] or str(),
						row[3] or str(),
						row[4].decode() if row[4] else str(),
						row[5].decode() if row[5] else str(),
						row[6].decode() if row[6] else str(),
						row[7].decode() if row[7] else str(),
						row[8].decode() if row[8] else str(),
						row[9].decode() if row[9] else str()
					]	for row in db
				]


			case "incomes":
				current = [
					[
						row[0],
						row[1].strftime("%d/%m/%Y") if row[1] else str(),
						row[2] or str(),
						row[3].decode() if row[3] else str(),
						row[4].decode() if row[4] else str(),
						row[5].decode() if row[5] else str(),
						row[6].decode() if row[6] else str(),
						row[7].decode() if row[7] else str(),
					]	for row in db
				]


			case "orders":
				current = [
					[
						row[0],
						row[1].strftime("%d/%m/%Y") if row[1] else str(),
						row[2] or str(),
						row[3] or str(),
						row[4].decode() if row[4] else str(),
						row[5].decode() if row[5] else str(),
						row[6].decode() if row[6] else str(),
					]	for row in db
				]


			case "notes":
				current = [
					[
						row[0],
						row[1].strftime("%d/%m/%Y") if row[1] else str(),
						row[2].strftime("%d/%m/%Y") if row[2] else str(),
						row[3] or str(),
						row[4] or str(),
						row[5].decode() if row[5] else str(),
						row[6].decode() if row[6] else str(),
						row[7].decode() if row[7] else str(),
						row[8].decode() if row[8] else str(),
						row[9].decode() if row[9] else str()
					]	for row in db
				]


		db.close()


	except	Exception as E:

		print(patronus(E))
		return list()

	else:

		connection.close()
		return current







