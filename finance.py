
from pinance import Pinance

symbol = "VALO.BA"
valo = Pinance("VALO.BA")
edn = Pinance("EDN.BA")
agro = Pinance("AGRO.BA")

valo.get_quotes()
edn.get_quotes()
agro.get_quotes()

print("precio " + valo.quotes_data['longName'] + ": ", valo.quotes_data['regularMarketPrice'])
print("precio " + edn.quotes_data['longName'] + ": ", edn.quotes_data['regularMarketPrice'])
print("precio " + agro.quotes_data['longName'] + ": ", agro.quotes_data['regularMarketPrice'])

