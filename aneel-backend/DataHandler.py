from plotly_resampler import FigureResampler, FigureWidgetResampler
import plotly.express as px
import plotly.graph_objects as go

from DataLoader import DataLoader
from os.path import exists
import geobr

import polars as pl

from time import time
from helpers.national_production import *

class DataHandler:
    def __init__(self):
        self.DATA_PATH = "./data/"
        self.DATA_FILE = "aneel.parquet"
        self.DATA_FILE_PATH = self.DATA_PATH + self.DATA_FILE

        self.DataLoader = DataLoader(self.DATA_FILE_PATH)
        self.lazyframe = self.update_data()
        self.primary_color = "#0d6efd"
        self.faded_color = "DimGrey"


    def update_data(self) -> pl.LazyFrame:
        print("[DataHandler] : Updating the data")
        has_no_data_file = not exists(self.DATA_FILE_PATH)

        if has_no_data_file:
            initial_time = time()
            self.DataLoader.load()
            print(f"[DataHandler] Loading time: {time() - initial_time:.2f}s.")

        lf = pl.scan_parquet(self.DATA_FILE_PATH)

        return lf.with_columns(
            pl.col("MdaPotenciaInstaladaKW").str.replace(",", ".")
            .cast(pl.Float64)
        )

    
    def catch_national_production_horizontal_plot_by_region(self) -> go.Figure:
        df = catch_national_production_horizontal_df(self.lazyframe, scope="NomRegiao")
        if df.shape[0] == 0:
            return go.Figure()

        df = df.sort("production")
        df = df.with_columns(
            pl.when(pl.col("location") == "Brasil")
            .then(pl.lit(self.primary_color))
            .otherwise(pl.lit(self.faded_color))
            .alias("color")
        )

        fig = go.Figure(
            go.Bar(
                x = df["production"],
                y = df["location"],
                marker_color = df["color"],
                orientation = 'h',
                customdata = df[["unit"]],  
                hovertemplate = '<b>Produção</b>: %{x:.2f} %{customdata[0]}<extra></extra>',
                hoverinfo = "skip"
            )
        )
        fig.update_layout(
            #title = "Produção, por região:",
            xaxis_title = f"Potência instalada ({df['unit'].unique()[0]})",
            yaxis_title = "Localização",
            margin={"r":0,"t":40,"l":0,"b":10},
        )

        return fig

    def catch_national_production_vertical_plot_by_region(self) -> go.Figure:
        df = catch_national_production_vertical_df(self.lazyframe, scope="NomRegiao")
        if df.shape[0] == 0:
            return go.Figure()

        df = df.sort("production", descending=True)

        fig = go.Figure(
            go.Bar(
                x = df["location"],
                y = df["production"],
                marker_color = self.primary_color,
                hovertemplate = '<b>Produção</b>: %{y:.2f}GW<extra></extra>',
                hoverinfo = "skip"
            )
        )
        fig.update_layout(
            #title = "Produção por região",
            xaxis_title = "Localização",
            yaxis_title = f"Potência instalada ({df['unit'].unique()[0]})",
            margin={"r":0,"t":40,"l":0,"b":10},
        )

        return fig


    def catch_national_production_map(self) -> go.Figure:
        map = geobr.read_state(year=2020)

        df = catch_national_production_df(self.lazyframe, scope="SigUF")
        df = df.to_pandas()

        df_map = map.merge(
            df,
            left_on='abbrev_state',
            right_on='location',
        )

        fig = go.Figure(
            go.Choropleth(
                geojson=df_map.geometry.__geo_interface__,
                locations=df_map.index,
                z=df_map["production"],
                text=df_map["location"],
                customdata=df_map[["production", "unit"]],
                colorscale="Dense",
                colorbar_title=f"Produção ({df_map['unit'][0]})",
                hovertemplate=(
                    "<b>%{text}</b><br>" +
                    "Produção: %{customdata[0]:.2f} %{customdata[1]}<extra></extra>"
                ),
            )
        )
        fig.update_geos(fitbounds="locations", visible=False)
        fig.update_layout(
            #title_text="Produção por estado",
            title_x=0.5,
            margin={"r":0,"t":40,"l":0,"b":0}
        )

        return fig



    ''' Future Feature
    def catch_national_production_bubbles(self) -> go.Figure:
        fig = go.Figure(
            go.Scatter(
                x = df["potency_sum"],
                y = df["micro_businesses_count"],
                marker = dict(
                    size = df["number_of_productors"],
                    #color=df["NomRegiao"],
                ),
                #hover_name=df["city_state"],
                #log_x = True,
                #size_max=60,
                hovertemplate = '<b>Produção</b>: %{x:.2f}kW<extra></extra>',
                hoverinfo ="skip"
            )
        )

        fig.update_layout(
            title = "Produção por região",
            xaxis_title = "Potência instalada (kW)",
            yaxis_title = "Número de microgedores (P)"
        )
        
        return fig

    def catch_national_production_bubbles(self) -> pl.DataFrame:
        location_cols = ["NomRegiao","NomMunicipio", "SigUF"]

        potency_lf = (
            lf.group_by(location_cols).agg(
                pl.col("MdaPotenciaInstaladaKW")
                .sum()
                .round(2)
                .alias("potency_sum"),

                pl.col("MdaPotenciaInstaladaKW")
                .is_not_null()
                .sum()
                .alias("number_of_productors"),

                pl.col("SigModalidadeEmpreendimento")
                .filter(pl.col("SigModalidadeEmpreendimento") == "P")
                .is_not_null()
                .sum()
                .alias("micro_businesses_count"),
            )
        )

        potency_lf = (
            potency_lf.with_columns(
                pl.concat_str(
                    [pl.col("NomMunicipio"), pl.col("SigUF")],
                    separator=", "
                ).alias("city_state")
            )
        )

        return potency_lf.collect()
    '''

