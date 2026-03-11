// ==UserScript==
// @name         Dashboard Injetado - CSA CLUSTER SC/PR
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Tabela Acrílico, Relógio Real-time e Monitoramento de Erros (Watchdog)
// @author       S@muel Luiz
// @match        *://hpbx01.brasiltecpar.com.br/manager/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    
    const estilos = `
        #meu-dashboard-customizado {
            box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333; margin: 0; padding: 0; min-height: 100vh;
            background-image: url('https://static.wixstatic.com/media/300e5a_95808568788d49c6a0e1a90a4dcfebf8~mv2.png/v1/fill/w_1851,h_900,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/300e5a_95808568788d49c6a0e1a90a4dcfebf8~mv2.png');
            background-size: cover; background-position: center; background-attachment: fixed;
        }
        #meu-dashboard-customizado * { box-sizing: border-box; }

        #meu-dashboard-customizado .navbar {
            background-color: rgba(38, 50, 56, 0.98); color: white; height: 60px; display: flex;
            align-items: center; justify-content: space-between; padding: 0 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); position: sticky; top: 0; z-index: 100;
        }
        #meu-dashboard-customizado .nav-left { display: flex; align-items: center; }
        #meu-dashboard-customizado .brand { font-size: 22px; font-weight: bold; margin-right: 40px; color: #fff; letter-spacing: 1px; text-transform: uppercase; }
        #meu-dashboard-customizado .tab-btn { background: transparent; border: none; color: #b0bec5; font-size: 16px; font-weight: 600; padding: 0 20px; height: 60px; cursor: pointer; border-bottom: 4px solid transparent; transition: all 0.3s ease; }
        #meu-dashboard-customizado .tab-btn:hover { color: white; background-color: rgba(255,255,255,0.1); }
        #meu-dashboard-customizado .tab-btn.active { color: white; border-bottom: 4px solid #40C4FF; background-color: rgba(255,255,255,0.1); }
        #meu-dashboard-customizado .btn-fechar-dash { background: #FF1744; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px; text-transform: uppercase; }

        /* NOVOS ESTILOS DO PAINEL DE STATUS E RELÓGIO */
        #meu-dashboard-customizado .status-container { display: flex; align-items: center; gap: 15px; margin-left: 20px; background: rgba(0,0,0,0.25); padding: 5px 15px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);}
        #meu-dashboard-customizado .relogio-top { font-size: 18px; font-weight: 900; color: #40C4FF; letter-spacing: 1.5px; border-right: 1px solid rgba(255,255,255,0.2); padding-right: 15px; }
        #meu-dashboard-customizado .conn-status { font-size: 12px; font-weight: bold; color: #fff; display: flex; align-items: center; transition: color 0.3s;}
        #meu-dashboard-customizado .conn-dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.5);}
        #meu-dashboard-customizado .dot-ok { background-color: #00E676; animation: blink-ok 2s infinite; }
        #meu-dashboard-customizado .dot-erro { background-color: #FF1744; animation: blink-erro 1s infinite; }
        #meu-dashboard-customizado .dot-warn { background-color: #FF9100; animation: blink-erro 1.5s infinite; }
        @keyframes blink-ok { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        @keyframes blink-erro { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }

        #meu-dashboard-customizado .main-content { padding: 25px; max-width: 1400px; margin: auto; }
        #meu-dashboard-customizado .tab-pane { display: none; animation: fadeIn 0.4s; }
        #meu-dashboard-customizado .tab-pane.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        #meu-dashboard-customizado .grid-dashboard { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

        #meu-dashboard-customizado .card { background: rgba(255, 255, 255, 0.95); border-radius: 8px; padding: 15px; color: #333; box-shadow: 0 4px 15px rgba(0,0,0,0.15); height: 240px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; position: relative; overflow: hidden; transition: transform 0.2s, background-color 0.3s; }
        #meu-dashboard-customizado .card:hover { transform: translateY(-3px); }
        #meu-dashboard-customizado .card.green { background-color: rgba(105, 240, 174, 0.98); color: #263238; }
        #meu-dashboard-customizado .card.blue { background-color: rgba(64, 196, 255, 0.98); color: #000; }
        #meu-dashboard-customizado .card.red { background-color: rgba(255, 23, 68, 0.98); color: #fff; }

        #meu-dashboard-customizado .card-title { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; opacity: 0.9; }
        #meu-dashboard-customizado .card-value { font-size: 85px; font-weight: 400; line-height: 1; margin: auto 0; outline: none; z-index: 2; }
        #meu-dashboard-customizado #card1 { font-size: 55px; font-weight: bold; }
        #meu-dashboard-customizado .card-sub { font-size: 16px; font-style: italic; opacity: 0.8; margin-top: 5px; }

        #meu-dashboard-customizado .donut-container { width: 140px; height: 140px; margin: auto; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; background: rgba(236, 239, 241, 1); }
        #meu-dashboard-customizado .donut-container::after { content: ''; position: absolute; width: 110px; height: 110px; background: white; border-radius: 50%; z-index: 1; }
        #meu-dashboard-customizado .donut-number { font-size: 45px; font-weight: bold; color: #455a64; z-index: 2; position: relative; outline: none; }

        #meu-dashboard-customizado .stats-column { display: flex; flex-direction: column; justify-content: center; align-items: flex-end; padding-right: 10px; background: rgba(255,255,255,0.95); border-radius: 8px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);}
        #meu-dashboard-customizado .stat-item { margin-bottom: 25px; text-align: right; }
        #meu-dashboard-customizado .stat-time { font-size: 32px; line-height: 1.2; color: #263238; font-weight: bold; margin-bottom: 4px; }
        #meu-dashboard-customizado .stat-label { font-size: 13px; color: #546e7a; text-transform: uppercase; font-weight: 600;}

        #meu-dashboard-customizado .panel-header { background: rgba(255, 255, 255, 0.85); padding: 15px; border-radius: 8px 8px 0 0; border-bottom: 1px solid rgba(0,0,0,0.1); text-align: center; font-weight: 900; color: #102A43; font-size: 18px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center; }
        #meu-dashboard-customizado .table-container { background: rgba(255, 255, 255, 0.7); border-radius: 0 0 8px 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow-x: auto; max-height: 600px;}
        #meu-dashboard-customizado table { width: 100%; border-collapse: collapse; min-width: 800px; }
        #meu-dashboard-customizado th { background-color: rgba(255, 255, 255, 0.6); color: #102A43; font-weight: 800; padding: 16px 12px; text-align: left; font-size: 14px; position: sticky; top: 0; z-index: 10; border-bottom: 2px solid rgba(0,0,0,0.1); }
        #meu-dashboard-customizado td { padding: 14px 12px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #102A43; font-size: 14px; font-weight: 700;}
        #meu-dashboard-customizado tr:hover td { background-color: rgba(255,255,255,0.4); }

        #meu-dashboard-customizado .status-icon { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; margin: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.2);}
        #meu-dashboard-customizado .st-pause { background-color: #FF1744; }
        #meu-dashboard-customizado .st-online { background-color: #00E676; }
        #meu-dashboard-customizado .st-chamada { background-color: #FF9100; }
    `;

    
    const htmlDashboard = `
        <div id="meu-dashboard-customizado">
            <div class="navbar">
                <div class="nav-left">
                    <div class="brand">CSA CLUSTER SC/PR</div>
                    <button class="tab-btn active" data-tab="wallboard">Monitoramento</button>
                    <button class="tab-btn" data-tab="agentes">Agentes On Line</button>

                    <div class="status-container">
                        <div class="relogio-top" id="relogio-digital">00:00:00</div>
                        <div class="conn-status" title="Status da tela atual"><div id="dot-painel" class="conn-dot dot-ok"></div> <span id="txt-painel">Painel: OK</span></div>
                        <div class="conn-status" title="Status da 2ª Aba (Relatórios)"><div id="dot-robo" class="conn-dot dot-warn"></div> <span id="txt-robo">Relatórios: Aguardando...</span></div>
                    </div>
                </div>
                <div class="edit-controls">
                    <button id="btnFecharDash" class="btn-fechar-dash">X Fechar Painel</button>
                </div>
            </div>

            <div class="main-content">
                <div id="wallboard" class="tab-pane active">
                    <div class="grid-dashboard">
                        <div class="card green">
                            <div class="card-title">Espera Mais Longa</div>
                            <div class="card-value" id="card1">-</div>
                        </div>
                        <div class="card">
                            <div class="card-title" style="color:#333">N. De Chamadas Em Espera</div>
                            <div class="donut-container" id="chart-bg-2"><div class="donut-number" id="card2" data-chart="chart-bg-2">0</div></div>
                        </div>
                        <div class="card">
                            <div class="card-title" style="color:#333">Núm. De Agentes Em Chamada</div>
                            <div class="donut-container" id="chart-bg-3"><div class="donut-number" id="card3" data-chart="chart-bg-3">0</div></div>
                        </div>
                        <div class="card">
                            <div class="card-title" style="color:#333">Agentes Disponíveis</div>
                            <div class="donut-container" id="chart-bg-4"><div class="donut-number" id="card4" data-chart="chart-bg-4">0</div></div>
                        </div>
                        <div class="card blue">
                            <div class="card-title">Chamadas Oferecidas</div>
                            <div class="card-value" id="card5">0</div><div class="card-sub">Chamadas Oferecidas</div>
                        </div>
                        <div class="card blue">
                            <div class="card-title">Chamadas Atendidas</div>
                            <div class="card-value" id="card6">0</div><div class="card-sub">Chamadas Atendidas</div>
                        </div>
                        <div class="card" id="card-perdidas-container">
                            <div class="card-title">Chamadas Perdidas</div>
                            <div class="card-value" id="card7">0</div><div class="card-sub">Chamadas Perdidas</div>
                        </div>
                        <div class="stats-column">
                            <div class="card-title" style="width:100%; text-align:center; margin-bottom:20px; color:#333;">Méd. Da Fila</div>
                            <div class="stat-item"><div class="stat-time" id="stat1">00:00:00</div><div class="stat-label">Méd. Conversação</div></div>
                            <div class="stat-item"><div class="stat-time" id="stat2">00:00:00</div><div class="stat-label">Méd. Espera</div></div>
                        </div>
                    </div>
                </div>

                <div id="agentes" class="tab-pane">
                    <div class="panel-header"><span>Status da Equipe em Tempo Real</span></div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th style="text-align:center; width: 60px;">Status</th>
                                    <th>Agente</th><th>Extensão</th><th>Estado / Pausa</th><th>Fila</th><th>Tempo (Estado)</th>
                                </tr>
                            </thead>
                            <tbody id="agentes-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    
    const styleEl = document.createElement('style'); styleEl.innerHTML = estilos; document.head.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.id = "overlay-dashboard-customizado";
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 100000; display: none; overflow-y: auto;";
    overlay.innerHTML = htmlDashboard; document.body.appendChild(overlay);

    const btnAbrir = document.createElement('button');
    btnAbrir.innerHTML = "📊 Abrir Painel CSA CLUSTER";
    btnAbrir.style.cssText = "position: fixed; top: 10px; right: 50px; z-index: 99999; padding: 6px 15px; background: #40C4FF; color: #000; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3);";
    setTimeout(() => { document.body.appendChild(btnAbrir); }, 2000);

    btnAbrir.onclick = () => { overlay.style.display = 'block'; };
    document.getElementById('btnFecharDash').onclick = () => { overlay.style.display = 'none'; };

    document.querySelectorAll('#meu-dashboard-customizado .tab-btn').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('#meu-dashboard-customizado .tab-pane').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('#meu-dashboard-customizado .tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(this.dataset.tab).classList.add('active'); this.classList.add('active');
        }
    });

   
    setInterval(() => {
        const agora = new Date();
        document.getElementById('relogio-digital').innerText = agora.toLocaleTimeString('pt-BR');
    }, 1000);

   
    function setStatusPainel(ok) {
        const dot = document.getElementById('dot-painel'); const txt = document.getElementById('txt-painel');
        if (ok) { dot.className = "conn-dot dot-ok"; txt.innerText = "Painel: OK"; txt.style.color = "#00E676"; }
        else { dot.className = "conn-dot dot-erro"; txt.innerText = "Painel: Erro Leitura"; txt.style.color = "#FF1744"; }
    }
    function setStatusRobo(estado) {
        const dot = document.getElementById('dot-robo'); const txt = document.getElementById('txt-robo');
        if (estado === 'ok') { dot.className = "conn-dot dot-ok"; txt.innerText = "Relatórios: OK"; txt.style.color = "#00E676"; }
        else if (estado === 'warn') { dot.className = "conn-dot dot-warn"; txt.innerText = "Relatórios: Aguardando..."; txt.style.color = "#FF9100"; }
        else { dot.className = "conn-dot dot-erro"; txt.innerText = "Relatórios: Parado/Fechado"; txt.style.color = "#FF1744"; }
    }

    

    function atualizarGraficosVisuais(cardId, chartId, valor) {
        const val = parseInt(valor) || 0;
        if (chartId) {
            const chartBg = document.getElementById(chartId);
            if (chartBg) chartBg.style.background = val === 0 ? `conic-gradient(rgba(236, 239, 241, 1) 0% 100%)` : `conic-gradient(#69F0AE 0% 75%, rgba(236, 239, 241, 1) 75% 100%)`;
        }
        if (cardId === 'card7') {
            const container = document.getElementById('card-perdidas-container');
            if (container) val === 0 ? container.classList.remove('red') : container.classList.add('red');
        }
    }

    function extrairEAtualizar() {
        const linhas = document.querySelectorAll('tr');

        let ativas = "0", emFila = "0", espera = "00:00:00", disp = "0";
        let achouFilaPrincipal = false;

        const tbody = document.getElementById('agentes-body');
        if(tbody) tbody.innerHTML = '';

        linhas.forEach(linha => {
            const colunas = linha.querySelectorAll('td');
            if (colunas.length < 5) return;

            const textoLinha = linha.innerText.toUpperCase();

            if (textoLinha.includes('FILA_CSA_GGNET') && textoLinha.includes('GGNET_ALT')) {
                achouFilaPrincipal = true;
                const getVal = (idx) => colunas[idx] ? colunas[idx].innerText.split('\\n')[0].trim() : "0";
                ativas = getVal(3); emFila = getVal(4); espera = getVal(5); disp   = getVal(6);
            }

            if (textoLinha.includes('GRUPO_CSA_GGNET') && colunas.length >= 8) {
                let nome = colunas[1] ? colunas[1].innerText.trim() : "Agente";
                let ramal = colunas[2] ? colunas[2].innerText.trim() : "-";
                let estadoBruto = colunas[3] ? colunas[3].innerText.trim() : "";
                let tempo = colunas[4] ? colunas[4].innerText.trim() : "00:00:00";

                let textoEstado = ""; let styleClass = ""; let icon = ""; let corEstadoTexto = "";

                if (estadoBruto.includes('local_phone')) {
                    textoEstado = "Disponível"; styleClass = "st-online"; icon = "👤"; corEstadoTexto = "#00A251";
                } else if (estadoBruto.includes('phone_in_talk')) {
                    let numeroTel = estadoBruto.replace('phone_in_talk', '').replace('\\n', '').trim();
                    textoEstado = numeroTel ? `Em Chamada (${numeroTel})` : "Em Chamada";
                    styleClass = "st-chamada"; icon = "📞"; corEstadoTexto = "#E65100";
                } else {
                    textoEstado = estadoBruto; styleClass = "st-pause"; icon = "☕"; corEstadoTexto = "#D50000";
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><div class="status-icon ${styleClass}" title="${textoEstado}">${icon}</div></td>
                    <td style="font-weight: 800;">${nome}</td><td>${ramal}</td>
                    <td style="font-weight: 800; color: ${corEstadoTexto};">${textoEstado}</td>
                    <td>FILA_CSA_GGNET</td><td>${tempo}</td>
                `;
                if(tbody) tbody.appendChild(tr);
            }
        });

        
        setStatusPainel(achouFilaPrincipal);

        
        let ofer = "0", atend = "0", perdidas = 0, medConv = "00:00:00", medEsp = "00:00:00";

        try {
            const dadosSalvos = localStorage.getItem('csa_dados_relatorio');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                ofer = dados.oferecidas || "0";
                atend = dados.atendidas || "0";
                perdidas = dados.perdidas || 0;
                medConv = dados.medConversacao || "00:00:00";
                medEsp = dados.medEspera || "00:00:00";

                
                const agora = Date.now();
                const diffSegundos = (agora - (dados.timestamp || 0)) / 1000;

                if (diffSegundos < 15) { setStatusRobo('ok'); } // Atualizado há menos de 15s
                else if (diffSegundos < 60) { setStatusRobo('warn'); } // Atrasado (15s a 60s)
                else { setStatusRobo('erro'); } // Parado há mais de 1 minuto (Fechou a aba)

            } else { setStatusRobo('warn'); }
        } catch(e) { setStatusRobo('erro'); }

        const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };

        setVal('card1', espera); setVal('card2', emFila); setVal('card3', ativas); setVal('card4', disp);
        setVal('card5', ofer); setVal('card6', atend); setVal('card7', perdidas > 0 ? perdidas : 0);
        setVal('stat1', medConv); setVal('stat2', medEsp);

        atualizarGraficosVisuais('card2', 'chart-bg-2', emFila);
        atualizarGraficosVisuais('card3', 'chart-bg-3', ativas);
        atualizarGraficosVisuais('card4', 'chart-bg-4', disp);
        atualizarGraficosVisuais('card7', null, perdidas > 0 ? perdidas : 0);
    }

    setInterval(extrairEAtualizar, 1500);

})();
