# utils
from datetime import datetime, date
import time, os

def convert_to_date(date_str: str) -> date:
    if date_str is None: return None
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    return date_obj


# current ym
def get_year_month():
    now = datetime.now()
    return now.strftime("%Y-%m")

# current timestamp
def get_timestamp():
    return int(time.time())

def check_page_num(page_num, count, page_size):
    max_page_num = (count + page_size - 1)
    if page_num > max_page_num - 1 and page_num > 0: 
        page_num = max_page_num - 1
    return page_num

def find_project_root():
    current_directory = os.path.abspath(__file__)
    
    while not os.path.exists(os.path.join(current_directory, 'doc')):
        current_directory = os.path.dirname(current_directory)
        
    return current_directory
