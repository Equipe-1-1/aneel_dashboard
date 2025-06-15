from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import plotly.graph_objects as go
import numpy as np
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

dh = DataHandler()
lf = dh.load_data()

@app.get("/plot-data/")
async def get_plot_data():
    x = np.arange(1_000_000)
    noisy_sin = (3 + np.sin(x / 200) + np.random.randn(len(x)) / 10) * x / 1_000

    fig = FigureResampler(go.Figure())
    fig.add_trace(go.Scattergl(name='noisy sine', showlegend=True), hf_x=x, hf_y=noisy_sin)

    fig = px.scatter(df.query("year==2007"), x="gdpPercap", y="lifeExp",
                 size="pop", color="continent",
                     hover_name="country", log_x=True, size_max=60)
    fig = fig.to_json()
    return json.loads(fig)


@app.get("/national-horizontal/")
async def get_national_horizontal():
    df = lf.select("MdaPotenciaInstaladaKW").sum().collect()
    
    fig = go.Figure(go.Bar(x=df["MdaPotenciaInstaladaKW"], y=["MdaPotenciaInstaladaKW"], orientation='h'))

    fig = fig.to_json()
    return json.loads(fig)
