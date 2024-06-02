import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options

# URL for Kakao Maps
url = 'https://map.kakao.com/'

# Chrome 옵션 설정
chrome_options = Options()
chrome_options.binary_location = '"C:/Program Files/Google/Chrome/Application/chrome.exe"'  # Chrome 브라우저 설치 경로
driver = webdriver.Chrome(options=chrome_options, executable_path="C:/Users/mjpar/Downloads/chromedriver-win64/chromedriver.exe")

driver.get(url)

key_word = '마트'  # Search term

# Function to wait until a CSS element is present
def time_wait(num, code):
    try:
        wait = WebDriverWait(driver, num).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, code)))
    except:
        print(code, '태그를 찾지 못하였습니다.')
        driver.quit()
    return wait

# Function to print mart information
def mart_list_print():
    time.sleep(0.2)
    # Find mart list
    mart_list = driver.find_elements(By.CSS_SELECTOR, '.placelist > .PlaceItem')
    
    for index in range(len(mart_list)):
        print(index)

        # Find place names
        names = driver.find_elements(By.CSS_SELECTOR, '.head_item > .tit_name > .link_name')
        # Find place types
        types = driver.find_elements(By.CSS_SELECTOR, '.head_item > .subcategory')
        # Find addresses
        address_list = driver.find_elements(By.CSS_SELECTOR, '.info_item > .addr')
        address = address_list[index].find_elements(By.CSS_SELECTOR, 'p')

        mart_name = names[index].text
        print(mart_name)

        mart_type = types[index].text
        print(mart_type)

        addr1 = address[0].text
        print(addr1)

        addr2 = address[1].text[5:]
        print(addr2)

        # Add data to dictionary
        dict_temp = {
            'name': mart_name,
            'type': mart_type,
            'address1': addr1,
            'address2': addr2
        }

        mart_dict['마트정보'].append(dict_temp)
        print(f'{mart_name} ...완료')

# Wait for the search bar to be present
time_wait(10, 'div.box_searchbar > input.query')

# Find the search bar and enter the keyword
search = driver.find_element(By.CSS_SELECTOR, 'div.box_searchbar > input.query')
search.send_keys(key_word)
search.send_keys(Keys.ENTER)

time.sleep(1)

# Click the place tab
place_tab = driver.find_element(By.CSS_SELECTOR, '#info\\.main\\.options > li.option1 > a')
place_tab.send_keys(Keys.ENTER)

time.sleep(1)

# Initialize mart dictionary
mart_dict = {'마트정보': []}
# Start time for crawling
start = time.time()
print('[크롤링 시작...]')

# Pagination variables
page = 1
page2 = 0
error_cnt = 0

while True:
    try:
        page2 += 1
        print("**", page, "**")

        # Click the page number
        driver.find_element(By.XPATH, f'//*[@id="info.search.page.no{page2}"]').send_keys(Keys.ENTER)

        # Crawl mart list
        mart_list_print()

        # Check if the next page is available
        mart_list = driver.find_elements(By.CSS_SELECTOR, '.placelist > .PlaceItem')
        if len(mart_list) < 15:
            break
        if not driver.find_element(By.XPATH, '//*[@id="info.search.page.next"]').is_enabled():
            break

        # If reached the 5th page, click the next button and reset page2
        if page2 % 5 == 0:
            driver.find_element(By.XPATH, '//*[@id="info.search.page.next"]').send_keys(Keys.ENTER)
            page2 = 0

        page += 1

    except Exception as e:
        error_cnt += 1
        print(e)
        print('ERROR!' * 3)

        if error_cnt > 5:
            break

print('[데이터 수집 완료]\n소요 시간 :', time.time() - start)
driver.quit()  # Close the browser

# Save data to JSON file
with open('data/mart_data.json', 'w', encoding='utf-8') as f:
    json.dump(mart_dict, f, indent=4, ensure_ascii=False)
