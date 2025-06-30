from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import polars as pl
import plotly.graph_objects as go
from plotly_resampler import FigureResampler, FigureWidgetResampler
import plotly.express as px
import json
from DataHandler import DataHandler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = px.data.gapminder()

data_handler = DataHandler()

@app.get("/dummy_data/")
async def get_dummy_data():
    fig = px.scatter(df.query("year==2007"),
        x="gdpPercap",
        y="lifeExp",
        size="pop", 
        color="continent",
        hover_name="country", log_x=True, size_max=60)
    
    fig = fig.to_json()
    return json.loads(fig)


@app.get("/national_production_horizontal_by_region/")
async def get_national_production_horizontal_by_region():
    plot_figure = data_handler.catch_national_production_horizontal_plot_by_region()
    plot_figure = plot_figure.to_json()
    return json.loads(plot_figure)

@app.get("/national_production_vertical_by_region/")
async def get_national_production_vertical():
    plot_figure = data_handler.catch_national_production_vertical_plot_by_region()
    plot_figure = plot_figure.to_json()
    return json.loads(plot_figure)

''' Next Level, Future Endpoint
@app.get("/national_production_bubbles/")
async def get_national_production_bubbles():
    plot_figure = catch_national_production_bubbles()
    plot_figure = plot_figure.to_json()
    return json.loads(plot_figure)
'''

@app.get("/national_production_map/")
async def get_national_production_map():
    plot_figure = data_handler.catch_national_production_map()
    plot_figure = plot_figure.to_json()
    return json.loads(plot_figure)
