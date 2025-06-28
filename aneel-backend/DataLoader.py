from concurrent.futures import ThreadPoolExecutor
from threading import Lock, Event

import pyarrow.parquet as pq
import pyarrow as pa

from time import sleep
from queue import PriorityQueue

import requests
from requests import ConnectionError

class DataLoader:
    def __init__(self, data_file_path: str):
        self.BASE_URL = "https://dadosabertos.aneel.gov.br/api/3/action/datastore_search"
        self.RESOURCE_ID = "b1bd71e7-d0ad-4214-9053-cbd58e9564a7"
        self.DATA_FILE_PATH = data_file_path
        self.REQUESTS_LIMIT = 32000
        self.lock = Lock()
        self.to_write = PriorityQueue()


    def load(self) -> None:
        try:
            answer = self.request_aneel(0)
            total, records = self.get_request_infos(answer)
            self.to_write.put((0, records))

            table = pa.Table.from_pylist(records)
            number_of_threads = total // self.REQUESTS_LIMIT

            with ThreadPoolExecutor(max_workers=21) as executor:
                writer_future = executor.submit(self.write_loads, table.schema, number_of_threads + 1)

                offset = self.REQUESTS_LIMIT
                for i in range(number_of_threads):
                    executor.submit(self.handle_aneel_request, offset)
                    offset += self.REQUESTS_LIMIT
                    sleep(0.05)

                writer_future.result()
        except Exception as e:
            raise ConnectionError(f"Some error: {e}")


    def request_aneel(self, offset: int)-> str:
        try:
            params = {
                "resource_id": self.RESOURCE_ID,
                "limit": self.REQUESTS_LIMIT,
                "offset": offset
            }

            answer = requests.get(self.BASE_URL, params=params).json()
            if not answer.get("success"):
                raise ConnectionError("Aneel service signalizing unsuccessful answer!")

            return answer.get("result")
        except:
            raise ConnectionError("Some error making a request")


    def handle_aneel_request(self, offset: int) -> None:
        try:
            answer = self.request_aneel(offset)
            _, records = self.get_request_infos(answer)
            self.to_write.put((offset, records))
        except Exception as e:
            print(f"Error in load_request: {e}")


    def get_request_infos(self, answer: dict)-> tuple[int, list[dict]]:
        total = answer.get("total")
        records = answer.get("records")
        return (total, records)

    def write_loads(self, schema: pa.Schema, num_producers: int) -> None:
        finished = 0
        with pq.ParquetWriter(self.DATA_FILE_PATH, schema) as writer:
            while finished < num_producers:
                _, records = self.to_write.get()
                if records:
                    finished += 1
                    table = pa.Table.from_pylist(records)
                    writer.write_table(table)
                    
