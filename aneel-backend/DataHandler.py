from plotly_resampler import FigureResampler, FigureWidgetResampler
import plotly.express as px
import plotly.graph_objects as go

from DataLoader import DataLoader
from os.path import exists

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
        df = catch_national_production_horizontal_data(self.lazyframe, scope="NomRegiao")

        fig = go.Figure(
            go.Bar(
                x = df["potency_sum"],
                y = df["NomRegiao"],
                marker_color = df["color"],
                orientation = 'h',
                hovertemplate = '<b>Produção</b>: %{x:.2f}kW<extra></extra>',
                hoverinfo = "skip"
                )
            )

        fig.update_layout(
            title = "Produção por região",
            xaxis_title = "Potência instalada (kW)"
            )

        return fig

    def catch_national_production_vertical_plot_by_region(self) -> go.Figure:
        df = catch_national_production_vertical_data(self.lazyframe, scope="NomRegiao")

        fig = go.Figure(
            go.Bar(
                x = df["NomRegiao"],
                y = df["potency_sum"],
                #marker_color = df["color"],
                hovertemplate = '<b>Produção</b>: %{x:.2f}kW<extra></extra>',
                hoverinfo = "skip"
                )
            )

        fig.update_layout(
            title = "Produção por região",
            xaxis_title = "Potência instalada (kW)"
            )

        return fig



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

