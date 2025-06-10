from	typing							import	Dict
from	typing							import	Tuple
from	operator						import	itemgetter
from	datetime						import	date
from	math							import	log
from	pygwarts.magical.spells			import	patronus
from	pygwarts.magical.time_turner	import	TimeTurner
import	mysql.connector					as		MYSQL








ORDER_CACHE	= dict()
TAB_CACHE	= dict()








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


			db.execute("INSERT INTO actsnprots (%s) VALUES (%s)"%(keys.strip(","), values.strip(",")))
			connection.commit()
			db.close()


		except	Exception as E:

			message = patronus(E)
			print(message)
			return message

		else:	connection.close()








def rows_comparator(table :str, index :Tuple[date|int|str]) -> date | int | str :
	def comparator(align_row :int) -> Tuple[date | int | str] :

		data = align_row[index]

		if	index == 1 or (table == "contracts" and str(index) in "89") or (table == "notes" and index == 2):
			return data or date(1,1,1)

		return data.lower() if data is not None else str()
		








async def get_office_tab(name :str, order :int, refresh :bool) -> Dict[str,str] :

	if	not refresh and (cached := TAB_CACHE.get(name)):
		if	order == ORDER_CACHE.get(name):

			print(f"cache and order hit for {name}")
			return cached


		else:


			print(f"cache hit for {name}")
			current = list()


			match name:
				case "actsnprots":

					for col in sorted(cached, key=itemgetter(int(log(int(order) >>1,2))), reverse=(not int(order) &1)):
						current.append([ col[0], col[1], col[2], col[3], col[4], col[5] ])



				case "contracts":

					for col in sorted(cached, key=itemgetter(int(log(int(order) >>1,2))), reverse=(not int(order) &1)):
						current.append([ col[0], col[1], col[2], col[3], col[4], col[5], col[6], col[7], col[8], col[9], col[10] ])


				case "letters":

					for col in sorted(cached, key=itemgetter(int(log(int(order) >>1,2))), reverse=(not int(order) &1)):
						current.append([ col[0], col[1], col[2], col[3], col[4], col[5], col[6], col[7], col[8] ])


				case "notes":

					for col in sorted(cached, key=itemgetter(int(log(int(order) >>1,2))), reverse=(not int(order) &1)):
						current.append([ col[0], col[1], col[2], col[3], col[4], col[5], col[6], col[7], col[8] ])
	else:
		try:

			current = list()
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
					for col in sorted(

						[[ value for value in row ] for row in db ],
						key=rows_comparator(name, int(log(int(order) >>1,2))),
						reverse=True
						# reverse=(not int(order) &1)
					):
						current.append(
							[
								col[1].strftime("%d/%m/%Y") if col[1] else str(),
								col[2].decode() if col[2] else str(),
								col[3] or str(),
								col[4].decode() if col[4] else str(),
								col[5].decode() if col[5] else str(),
								col[6].decode() if col[6] else str()
							]
						)
					# for col in sorted(
					# 	[
					# 		[
					# 			C.decode() if isinstance(C,bytes) else
					# 			C.strftime("%d/%m/%Y") if isinstance(C,date) else
					# 			C if C else
					# 			str()
					# 			for C in R
					# 		]
					# 		for R in db
					# 	],
					# 	key=itemgetter(int(log(int(order) >>1,2)) +1),
					# 	reverse=(not int(order) &1)
					# ):
					# 	current.append([ col[1], col[2], col[3], col[4], col[5], col[6] ])


				case "contracts":
					for col in sorted(
						[
							[
								C.decode() if isinstance(C,bytes) else
								C.strftime("%d/%m/%Y") if isinstance(C,date) else
								C if C else
								str()
								for C in R
							]
							for R in db
						],
						key=itemgetter(int(log(int(order) >>1,2)) +1),
						reverse=(not int(order) &1)
					):
						current.append([ col[1], col[2], col[3], col[4], col[5], col[6], col[7], col[8], col[9], col[10], col[11] ])


				case "letters":
					for col in sorted(
						[
							[
								C.decode() if isinstance(C,bytes) else
								C.strftime("%d/%m/%Y") if isinstance(C,date) else
								C if C else
								str()
								for C in R
							]
							for R in db
						],
						key=itemgetter(int(log(int(order) >>1,2)) +1),
						reverse=(not int(order) &1)
					):
						current.append([ col[1], col[2], col[3], col[4], col[5], col[6], col[7], col[8], col[9] ])


				case "notes":
					for col in sorted(
						[
							[
								C.decode() if isinstance(C,bytes) else
								C.strftime("%d/%m/%Y") if isinstance(C,date) else
								C if C else
								str()
								for C in R
							]
							for R in db
						],
						key=itemgetter(int(log(int(order) >>1,2)) +1),
						reverse=(not int(order) &1)
					):
						current.append([ col[1], col[2], col[3], col[4], col[5], col[6], col[7], col[8], col[9] ])


				case _:	current = list()


			db.close()


		except	Exception as E:

			print(f"{E.__class__.__name__}: {E}")
			return list()

		else:	connection.close()


	if	current:

		TAB_CACHE[name]		= current
		ORDER_CACHE[name]	= order

	return current







