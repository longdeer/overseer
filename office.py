from	typing			import Dict
from	math			import log
from	operator		import itemgetter
from	datetime		import date
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

		current = list()
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


		match name:

			case "actsnprots":
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
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					current.append(
						{
							"date":		col[1],
							"category":	col[2],
							"number":	col[3],
							"content":	col[4],
							"author":	col[5],
							"comment":	col[6],
						}
					)


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
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					current.append(
						{
							"date":			col[1],
							"number":		col[2],
							"eosed":		col[3],
							"content":		col[4],
							"agent":		col[5],
							"insigner":		col[6],
							"outsigner":	col[7],
							"fmdate":		col[8],
							"todate":		col[9],
							"price":		col[10],
							"comment":		col[11],
						}
					)


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
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					current.append(
						{
							"date":		col[1],
							"number":	col[2],
							"eosed":	col[3],
							"theme":	col[4],
							"receiver":	col[5],
							"address":	col[6],
							"signer":	col[7],
							"author":	col[8],
							"comment":	col[9],
						}
					)


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
					key=itemgetter(order_col),
					reverse=is_reversed
				):
					current.append(
						{
							"date":		col[1],
							"reg":		col[2],
							"number":	col[3],
							"eosed":	col[4],
							"theme":	col[5],
							"receiver":	col[6],
							"signer":	col[7],
							"author":	col[8],
							"comment":	col[9],
						}
					)


			case _:	current = dict()


		db.close()


		if current : TAB_CACHE[name] = current
		return current


	except	Exception as E:

		print(f"{E.__class__.__name__}: {E}")
		return dict()

	else:	connection.close()







