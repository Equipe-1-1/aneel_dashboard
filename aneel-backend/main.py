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

@app.get("/national_production_bubbles/")
async def get_national_production_bubbles():
    plot_figure = catch_national_production_bubbles()
    plot_figure = plot_figure.to_json()
    return json.loads(plot_figure)

@app.get("/national_production_map/")
async def get_national_production_map():
    plot_figure = data_handler.catch_national_production_map()
    plot_figure = plot_figure.to_json()
    return json.loads(plot_figure)

@app.get("/national_map/")
async def get_national__map():
    plot_figure = data_handler.catch_national_production_map()
    plot_figure = plot_figure.to_json()
    return json.loads(plot_figure)
    import plotly.express as px
    import pandas as pd
    import polars as pl

    # --- 1. Carregar o mapa do Ceará usando geobr (muito mais estável) ---
    # A biblioteca cuida dos links. O ano 2020 é o mais recente disponível para malhas.
    df_mapa_ceara = geobr.read_municipality(year=2020)

    # --- 2. Carregar o seu arquivo CSV local com a população ---
    # Use o mesmo arquivo 'populacao_2022.csv' que você baixou na Solução 1.
    try:
        df_population = pl.read_excel('data/pib_municipios_2010_2021.xlsx')
    except FileNotFoundError:
        print("ERRO: O arquivo 'populacao_2022.csv' não foi encontrado.")
        print("Por favor, baixe o arquivo do IBGE e salve-o como CSV na mesma pasta.")
        exit()

    # --- 3. Unir os dados do mapa com os dados da população ---
    # Limpar e preparar os dados da população
    df_population = df_population.filter((pl.col("Ano") == 2021) & (pl.col("Sigla da Unidade da Federação") == "CE"))
    df_population = df_population.to_pandas()

    # Unir os dois dataframes (o do mapa e o da população)
    df_final_ceara = df_mapa_ceara
    ''' df_mapa_ceara.merge(
        df_population,
        left_on='code_muni',
        right_on='Código do Município'
    )'''

    # --- 4. Criar o Mapa ---
    # Plotly Express pode usar o GeoDataFrame do geobr diretamente!
    fig = px.choropleth(
        df_final_ceara,
        geojson=df_final_ceara.geometry, # Usa a coluna de geometria
        locations=df_final_ceara.index,    # Usa o índice do dataframe
        #color='Produto Interno Bruto per capita, \r\na preços correntes\r\n(R$ 1,00)',
        #color_continuous_scale="PuBu",
        labels={'pop_2022': 'População (Censo 2022)'},
        hover_name='name_muni'
    )

    fig.update_geos(fitbounds="locations", visible=False)
    fig.update_layout(
        title_text="População dos Municípios do Ceará (Censo 2022) - via geobr",
        title_x=0.5,
        margin={"r":0,"t":40,"l":0,"b":0}
    )

    plot_figure = fig.to_json()
    return json.loads(plot_figure)