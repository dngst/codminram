from bs4 import BeautifulSoup
import requests as r
import csv

wiki_page_request = r.get("https://en.wikipedia.org/wiki/Call_of_Duty")
wiki_page_text = wiki_page_request.text

soup = BeautifulSoup(wiki_page_text, 'html.parser')
required_table = soup.select_one("table:nth-of-type(2)")

headers = ["Title", "Year"]

rows = []
data_rows = required_table.find_all('tr')

for row in data_rows:
  cols = row.find_all('td')[:2]
  beautified_value = [col.text.strip() for col in cols]
  if len(beautified_value) == 0:
    continue
  rows.append(beautified_value)

with open('cod_releases_draft.csv', 'w', newline="") as output:
  writer = csv.writer(output)
  writer.writerow(headers)
  writer.writerows(rows)
