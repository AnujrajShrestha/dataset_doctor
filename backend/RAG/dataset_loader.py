from pathlib import Path
import shutil
import pandas as pd

file_data= None

upload_dir= Path(__file__).parent/'uploads'
upload_dir.mkdir(parents=True,exist_ok=True)

def dataset_loader(file_path):
    global file_data
    file_path= Path(file_path)
    
    if file_path.suffix.lower() not in ['.csv','.json','.xlsx','.xls']:
        raise ValueError("Unsopprted file type")
    
    saved_path= upload_dir/file_path.name
    shutil.copy(file_path,saved_path)
    
    if file_path.suffix.lower()== ".csv":
        file_data= pd.read_csv(file_path)
    elif file_path.suffix.lower()== ".json":
        file_data= pd.read_json(file_path)
    elif file_path.suffix.lower() in ['.xlsx','.xls']:
        file_data= pd.read_excel(file_path)
    return file_data
    


# print(dataset_loader(r"c:\Users\anujs\Desktop\Anuj\nyc_airbnb_room_prediction\AB_NYC_2019.csv"))