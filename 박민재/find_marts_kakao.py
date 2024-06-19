import csv
import requests
import time
from tinydb import TinyDB, Query

# Kakao API를 사용하기 위한 key값과 주소 설정
app_key = 'KakaoAK ' + '7c5f84db921461a4f631890b4c0199ed'  # 여기에 실제 Kakao API 키를 넣으세요.
url = 'https://dapi.kakao.com/v2/local/search/keyword.json'

# TinyDB 데이터베이스 초기화
db = TinyDB('marts_db.json')
Mart = Query()

# 최소 분할 크기 설정
MIN_DIVISION_SIZE = 0.01

def get_store_list(start_x, start_y, end_x, end_y):
    if end_x - start_x < MIN_DIVISION_SIZE or end_y - start_y < MIN_DIVISION_SIZE:
        return []  # 너무 작은 영역에서는 더 이상 분할하지 않음
    
    offset = 0.01
    cnt = 1
    resp_list = []
    while True:
        params = {
            'query': '마트',
            'page': cnt,
            'rect': f'{start_x - offset},{start_y - offset},{end_x + offset},{end_y + offset}'
        }
        headers = {
            'Authorization': app_key
        }
        resp = requests.get(url, params=params, headers=headers)
        time.sleep(0.1)  # API 요청 사이에 잠시 대기하여 API 사용량 조절

        search_count = resp.json()['meta']['total_count']
        print(f'Area {start_x},{start_y},{end_x},{end_y}: {search_count} results found')

        if search_count > 45:
            dividing_x = (start_x + end_x) / 2
            dividing_y = (start_y + end_y) / 2
            resp_list.extend(get_store_list(start_x, start_y, dividing_x, dividing_y))
            resp_list.extend(get_store_list(dividing_x, start_y, end_x, dividing_y))
            resp_list.extend(get_store_list(start_x, dividing_y, dividing_x, end_y))
            resp_list.extend(get_store_list(dividing_x, dividing_y, end_x, end_y))
            return resp_list
        else:
            resp_list.extend(resp.json()['documents'])
            if resp.json()['meta']['is_end']:
                return resp_list
            else:
                cnt += 1

# 시작 x 좌표 및 증가값
start_x = 126  # ~ 129.7, 3.4
jump_x = 0.5
jump_y = 0.5

# 데이터를 저장할 CSV 파일 열기
with open('marts_data.csv', mode='w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['장소 이름', '위도', '경도']  # 필드명 설정
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # CSV 파일 헤더 작성
    writer.writeheader()

    # 지도를 사각형으로 나누면서 데이터 받아옴
    for i in range(1, 10):
        end_x = start_x + jump_x
        start_y = 33  # ~ 38.3, 4.9
        for j in range(1, 13):
            end_y = start_y + jump_y
            mart_list_one = get_store_list(start_x, start_y, end_x, end_y)
            for mart in mart_list_one:
                if not db.search(Mart.id == mart['id']):
                    writer.writerow({
                        '장소 이름': mart['place_name'],  # 한글 장소 이름으로 변경
                        '위도': float(mart['x']),  # 위도만 저장
                        '경도': float(mart['y']),  # 경도만 저장
                    })
            start_y = end_y
        start_x = end_x

# 데이터베이스에 저장된 마트 수 출력
print(f"Total marts stored: {len(db)}")
