from plotly_resampler import FigureResampler, FigureWidgetResampler
import plotly.express as px
import plotly.graph_objects as go

import polars as pl
import pandas as pd

def catch_national_production_horizontal_df(lazyframe, scope: str) -> pl.DataFrame:
    df = catch_national_production_df(lazyframe, scope)
    if df.shape[0] == 0:
        return df

    return pl.concat(
        [
            df,
            pl.DataFrame({
                "location": ["Brasil"],
                "unit": [df["unit"].unique()[0]],
                "production": [df["production"].sum()],
            })
        ],
        how = "vertical_relaxed"
    )


def catch_national_production_vertical_df(lazyframe: pl.LazyFrame, scope: str) -> pl.DataFrame:
    df = catch_national_production_df(lazyframe, scope)
    return df

def catch_national_production_df(lazyframe: pl.LazyFrame, scope: str) -> pl.DataFrame:
    lf = lazyframe.group_by(scope).agg(
        pl.lit("kW").alias("unit"),
        pl.col("MdaPotenciaInstaladaKW")
        .sum().round(2).alias("production")
    )
    lf = lf.rename({ scope: "location" })
    df = lf.collect()
    min_potency = df["production"].min()
    
    if min_potency // 10**6 > 0:
        df = df.with_columns(
            pl.col("production") / 10**6,
            pl.lit("GW").alias("unit")
        )
    elif min_potency // 10**3 > 0:
        df = df.with_columns(
            pl.col("production") / 10**3,
            pl.lit("MW").alias("unit")
        )

    return df