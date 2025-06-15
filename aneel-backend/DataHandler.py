import requests
import polars as pl
from datetime import datetime as time
import json
import io
import pandas as pd

class DataHandler:
    def __init__(self):
        self.base_url = "https://dadosabertos.aneel.gov.br"
        self.result_total = self.get_result_total()

    
    def get_result_total(self) -> str:
        url = self.get_initial_url(0)
        answer = requests.get(url).json()
        return answer.get("result").get("total")

    
    def get_initial_url(self, limit: int) -> str:
        return f"{self.base_url}/api/3/action/datastore_search" + \
            f"?resource_id=b1bd71e7-d0ad-4214-9053-cbd58e9564a7&limit={limit}"

    
    def load_data(self) -> pl.LazyFrame:        
        url = self.get_initial_url(self.result_total)
        answer = requests.get(url).json()

        records = answer.get("result").get("records")
        
        lf = pl.LazyFrame(records)

        return lf.with_columns(
            pl.col("MdaPotenciaInstaladaKW").str.replace(",", ".")
            .cast(pl.Float64)
        )
