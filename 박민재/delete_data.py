import pandas as pd 

# CSV 파일을 데이터프레임으로 읽어옵니다.
df = pd.read_csv('marts_data.csv')

# '장소 이름' 열을 기준으로 중복된 행을 제거합니다.
df = df.drop_duplicates(subset=['장소 이름'], keep='first')

# 수정된 데이터프레임을 CSV 파일로 저장합니다.
df.to_csv('marts_data.csv', encoding='utf-8-sig', index=False)
