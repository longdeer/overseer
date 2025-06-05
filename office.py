from	typing			import Dict
from	math			import log
from	operator		import itemgetter
from	datetime		import date
import	mysql.connector	as MYSQL








ORDER_CACHE	= dict()
TAB_CACHE	= dict()








async def get_office_tab(name :str, order :int) -> Dict[str,str] :

	if	(cached := TAB_CACHE.get(name)):
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
						current.append([ col[1], col[2], col[3], col[4], col[5], col[6] ])


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







