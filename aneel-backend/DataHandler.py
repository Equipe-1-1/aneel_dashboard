from DataLoader import DataLoader
from os.path import exists

import polars as pl

from time import time

class DataHandler:
    def __init__(self):
        self.DATA_PATH = "./data/"
        self.DATA_FILE = "aneel.parquet"
        self.DATA_FILE_PATH = self.DATA_PATH + self.DATA_FILE
        self.data_loader = DataLoader(self.DATA_FILE_PATH)

    def LazyFrame(self):
        has_no_data_file = not exists(self.DATA_FILE_PATH)

        if has_no_data_file:
            init_time = time()
            self.data_loader.load()
            print(f"Loading data took {time() - init_time:.2f} seconds.")

        lf = pl.scan_parquet(self.DATA_FILE_PATH)

        return lf.with_columns(
            pl.col("MdaPotenciaInstaladaKW").str.replace(",", ".")
            .cast(pl.Float64)
        )
