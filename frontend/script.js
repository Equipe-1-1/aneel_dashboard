// Função para carregar os arquivo JSON de gráfico
async function loadAndPlotGraph(graphJsonFilename, plotDivId) {
    try {
        const response = await fetch(graphJsonFilename);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${graphJsonFilename}: ${response.statusText}`);
        }
        const graphConfig = await response.json(); 

        // Renderiza o gráfico usando Plotly
        Plotly.newPlot(plotDivId, graphConfig.data, graphConfig.layout);
        console.log(`Gráfico ${graphJsonFilename} carregado e renderizado em #${plotDivId}`);

        // Adiciona botões de exportação
        addExportButtons(plotDivId);

    } catch (error) {
        console.error("Erro ao carregar ou renderizar gráfico:", error);
        document.getElementById(plotDivId).innerHTML = `<p style="color: red;">Erro ao carregar o gráfico: ${error.message}</p>`;
    }
}

// Função para adicionar botões de exportação para cada gráfico
function addExportButtons(plotDivId) {
    const parentDiv = document.getElementById(plotDivId).closest('.chart-container');
    let buttonsDiv = parentDiv.querySelector('.plotly-buttons');

    if (!buttonsDiv) { 
        buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'plotly-buttons';
        parentDiv.appendChild(buttonsDiv);
    } else {
        buttonsDiv.innerHTML = ''; 
    }

    const exportPngBtn = document.createElement('button');
    exportPngBtn.textContent = 'Exportar PNG';
    exportPngBtn.onclick = () => Plotly.downloadImage(plotDivId, {format: 'png', filename: plotDivId + '_grafico'});
    buttonsDiv.appendChild(exportPngBtn);

    const exportSvgBtn = document.createElement('button');
    exportSvgBtn.textContent = 'Exportar SVG';
    exportSvgBtn.onclick = () => Plotly.downloadImage(plotDivId, {format: 'svg', filename: plotDivId + '_grafico'});
    buttonsDiv.appendChild(exportSvgBtn);

}

// Função para mostrar/esconder os conteiners dos gráficos
function showGraph(graphId) {
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach(container => {
        if (graphId === 'all') {
            container.classList.remove('hidden');
        } else if (graphId === 'none') {
            container.classList.add('hidden');
        } else if (container.id === graphId) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    });
}

// Chamadas para carregar e plotar todos os gráficos
document.addEventListener('DOMContentLoaded', () => {
    loadAndPlotGraph('grafico_estado.json', 'graph_estado_plot');
    loadAndPlotGraph('grafico_fonte_energia.json', 'graph_fonte_energia_plot');
    loadAndPlotGraph('grafico_classe_consumo.json', 'graph_classe_consumo_plot');
    // REMOVIDO: loadAndPlotGraph('grafico_tendencia_potencia.json', 'graph_tendencia_potencia_plot');
    loadAndPlotGraph('grafico_empreendimentos_recentes.json', 'graph_empreendimentos_recentes_plot');
    loadAndPlotGraph('grafico_ranking_municipios.json', 'graph_ranking_municipios_plot');

    showGraph('graph_estado_container'); 
});