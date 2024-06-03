import pandas as pd
import pymysql

# DB 정보
host = "localhost"
user = "root"
password = "1234"
database = "grabage"

# 엑셀 파일 불러오기
df = pd.read_excel("E:/대학교/3학년 1학기/창의프로젝트/project/Umm/src/server/marts_data.xlsx", nrows=18491)

# DB 연결
conn = pymysql.connect(host=host, user=user, password=password, db=database)
curs = conn.cursor()

# DB insert
sql = 'INSERT INTO location (locationName, latitude, longitude) VALUES (%s, %s, %s)'

for idx, row in df.iterrows():
    latitude = str(row['latitude']) if not pd.isnull(row['latitude']) else None
    longitude = str(row['longitude']) if not pd.isnull(row['longitude']) else None
    curs.execute(sql, (row['locationName'], latitude, longitude))

conn.commit()

#종료
curs.close()
conn.close()
