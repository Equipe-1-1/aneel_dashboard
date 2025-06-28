from plotly_resampler import FigureResampler, FigureWidgetResampler
import plotly.express as px
import plotly.graph_objects as go

import polars as pl

def catch_national_production_horizontal_data(lazyframe, scope: str) -> pl.DataFrame:
    lfs = catch_national_production_lazyframes(lazyframe, scope)
    lfs.append(
        lazyframe.select(
            pl.lit("Produção Nacional").alias(scope),
            pl.col("MdaPotenciaInstaladaKW")
            .sum().round(2).alias("potency_sum")
            )
        )

    potency_lf = pl.concat(lfs)
    potency_lf = potency_lf.sort("potency_sum")
    potency_lf = potency_lf.with_columns(
        pl.when(pl.col(scope) == "Produção Nacional")
        .then(pl.lit("RoyalBlue"))
        .otherwise(pl.lit("DimGrey"))
        .alias("color")
        )
    return potency_lf.collect()


def catch_national_production_vertical_data(lazyframe: pl.LazyFrame, scope: str) -> pl.DataFrame:
    lfs = catch_national_production_lazyframes(lazyframe, scope)

    potency_lf = pl.concat(lfs)
    potency_lf = potency_lf.sort("potency_sum")
    return potency_lf.with_columns(
        pl.when(pl.col(scope) == "Produção Naciona")
        .then(pl.lit("RoyalBlue"))
        .otherwise(pl.lit("DimGrey"))
        .alias("color")
        ).collect()

def catch_national_production_lazyframes(lazyframe: pl.LazyFrame, scope: str) -> pl.LazyFrame:
    return [
        lazyframe.group_by(scope).agg(
            pl.col("MdaPotenciaInstaladaKW")
            .sum().round(2).alias("potency_sum")
            )
        ]