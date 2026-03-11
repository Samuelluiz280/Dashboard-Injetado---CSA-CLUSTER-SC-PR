// ==UserScript==
// @name         Dashboard Injetado - Relatórios CSA
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Clica em Buscar, salva dados e envia SINAL DE VIDA
// @author       S@muel Luiz
// @match        *://hpbx01.brasiltecpar.com.br/manager/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function extrairDadosRelatorio() {
        const botoes = document.querySelectorAll('button');
        const btnBuscar = Array.from(botoes).find(b => b.innerText.trim() === 'Buscar');

        if (!btnBuscar) return;

        btnBuscar.click();

        setTimeout(() => {
            const linhas = document.querySelectorAll('tbody tr');
            if (linhas.length === 0) return;

            let atendidas = 0; let perdidas = 0;
            let totalEsperaSeg = 0; let totalFaladoSeg = 0;

            const tempoParaSeg = (tempoStr) => {
                const partes = tempoStr.split(':');
                if(partes.length !== 3) return 0;
                return (+partes[0]) * 3600 + (+partes[1]) * 60 + (+partes[2]);
            };

            const segParaTempo = (segundos) => {
                if (isNaN(segundos) || segundos < 0) return "00:00:00";
                const h = Math.floor(segundos / 3600).toString().padStart(2, '0');
                const m = Math.floor((segundos % 3600) / 60).toString().padStart(2, '0');
                const s = Math.floor(segundos % 60).toString().padStart(2, '0');
                return `${h}:${m}:${s}`;
            };

            linhas.forEach(linha => {
                const colunas = linha.querySelectorAll('td');
                if (colunas.length >= 13) {
                    const status = colunas[13].innerText.trim().toLowerCase();
                    const esperaStr = colunas[11].innerText.trim();
                    const faladoStr = colunas[12].innerText.trim();

                    if (status.includes('atendida')) { atendidas++; } else { perdidas++; }
                    totalEsperaSeg += tempoParaSeg(esperaStr);
                    totalFaladoSeg += tempoParaSeg(faladoStr);
                }
            });

            const oferecidas = atendidas + perdidas;
            const medEspera = oferecidas > 0 ? segParaTempo(totalEsperaSeg / oferecidas) : "00:00:00";
            const medConversacao = atendidas > 0 ? segParaTempo(totalFaladoSeg / atendidas) : "00:00:00";

            
            const dadosParaSalvar = {
                oferecidas, atendidas, perdidas, medConversacao, medEspera,
                timestamp: Date.now() 
            };
            localStorage.setItem('csa_dados_relatorio', JSON.stringify(dadosParaSalvar));

        }, 1500);
    }

  
    setInterval(extrairDadosRelatorio, 8000);
})();
