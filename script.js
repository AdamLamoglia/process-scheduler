var num_processos;
var quantum;
var sobrecarga;
var escalonamento;

//vetores
var tempos_chegada = [],
    prioridades = [],
    tempos_execucao = [],
    deadlines = [],
    processos = [],
    paginas = [];

var table;
var cells;

var tempo_real;

class Processo {

    constructor(tempo_chegada, tempo_execucao, deadline, id) {
        this.tempo_chegada = tempo_chegada;
        this.tempo_execucao = tempo_execucao;
        this.deadline = deadline;
        this.id = id;
        this.visitado = false;
        this.estaNoDisco = false;
        this.executando = false;
        this.estaNaRam = false;
        this.rr = false;
    }
}

class Pagina {

    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
    }
}

function criarFields() {

    num_processos = document.getElementById("num_processos").value

    var div = document.getElementById('container');

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    container.appendChild(document.createElement("br"));

    for (i = 0; i < num_processos; i++) {

        container.appendChild(document.createTextNode("Processo " + i));
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //tempo chegada
        container.appendChild(document.createTextNode("Tempo de Chegada: "));
        var input = document.createElement("input");
        input.type = "text";
        input.id = "tchegada" + i;
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //tempo execução

        container.appendChild(document.createTextNode("Tempo de Execução: "));
        input = document.createElement("input");
        input.type = "text";
        input.id = "texec" + i;
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //deadline
        container.appendChild(document.createTextNode("Deadline: "));
        input = document.createElement("input");
        input.type = "text";
        input.id = "deadline" + i;
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

    }


}

function deletarFields() {

    for (i = 0; i < num_processos; i++) {

        processos[i] = new Processo(parseInt(document.getElementById("tchegada" + i).value), parseInt(document.getElementById("texec" + i).value),
            parseInt(document.getElementById("deadline" + i).value), i + 1, false, false);

    }

    for (i = 0; i < 7; i++) {

        paginas[i] = new Pagina(-1, -1);
    }

    var div = document.getElementById('container');

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function criarGraficoDeGantt() {

    table = document.getElementById("gantt");

    table.createCaption().innerHTML = "Tempo: 0"

    var time;

    timeline = document.getElementById("tempo");

    time = timeline.insertCell(-1);
    time.innerHTML = "Processo";

    time = timeline.insertCell(-1);
    time.innerHTML = "TC";

    time = timeline.insertCell(-1);
    time.innerHTML = "TE";

    time = timeline.insertCell(-1);
    time.innerHTML = "DL";

    //Cria colunas
    for (i = 0; i < 50; i++) {

        time = timeline.insertCell(-1);
        time.innerHTML = i;
    }

    //Cria linhas
    for (i = 0; i < num_processos; i++) {

        table = document.getElementById("gantt");

        var row = table.insertRow(-1);

        time = row.insertCell(-1);
        time.innerHTML = i;

        time = row.insertCell(-1);
        time.innerHTML = processos[i].tempo_chegada;

        time = row.insertCell(-1);
        time.innerHTML = processos[i].tempo_execucao;

        time = row.insertCell(-1);
        time.innerHTML = processos[i].deadline;

        //Cria colunas para cada linha
        for (j = 0; j < 50; j++) {

            time = row.insertCell(-1);
            time.innerHTML = "&nbsp";
            time.width = "90px"
        }

    }

    //labels  = document.getElementById("legendas");

    timeline = document.getElementById("corExec");

    time = timeline.insertCell(0);
    time.innerHTML = "Executando";
    time.style.backgroundColor = "blue";

    timeline = document.getElementById("corTC");

    time = timeline.insertCell(0);
    time.innerHTML = "Troca de contexto";
    time.style.backgroundColor = "red";

}

function criarDisco() {
    var time;

    table = document.getElementById('disco');

    var nome = table.createCaption();

    nome.innerHTML = "Disco";

    //Cria linhas
    for (i = 0; i < 7; i++) {

        table = document.getElementById("disco");

        var row = table.insertRow(-1);


        //Cria colunas para cada linha
        for (j = 0; j < 13; j++) {

            time = row.insertCell(-1);
            time.innerHTML = "-";
            time.width = "90px"
        }

    }


}

function criarRam() {

    var time,
        row;

    table = document.getElementById('ram');

    var nome = table.createCaption();

    nome.innerHTML = "Ram";

    //Cria linhas
    for (i = 0; i < 10; i++) {

        table = document.getElementById("ram");

        row = table.insertRow(-1);


        //Cria colunas para cada linha
        for (j = 0; j < 5; j++) {

            time = row.insertCell(-1);
            time.innerHTML = "-";
            time.width = "90px"
        }


    }

}

function referenciarPagDisco(id) {


    var table = document.getElementById('disco');
    var cells,
        lugar = 0;

    //encontra local livre
    for (var j = 0; j < 13; j++) {

        if (lugar == paginas.length)
            break;

        for (var i = 1; i <= 7; i++) {

            cells = table.rows.item(i).cells;

            if (lugar == paginas.length)
                break;

            if (cells.item(j).innerHTML == "-") {
                paginas[lugar].linha = i;
                paginas[lugar].coluna = j;
                lugar++;

            }

        }

    }

    //escreve no local livre
    for (var i = 0; i < paginas.length; i++) {
        cells = table.rows.item(paginas[i].linha).cells;
        cells.item(paginas[i].coluna).innerHTML = "P" + (id - 1);
    }


}

function retirarPagDisco(id) {

    var table = document.getElementById('disco');
    var cells,
        lugar = 0;

    //encontra local livre
    for (var j = 0; j < 13; j++) {

        if (lugar == paginas.length)
            break;

        for (var i = 1; i <= 7; i++) {

            cells = table.rows.item(i).cells;

            if (lugar == paginas.length)
                break;

            if (cells.item(j).innerHTML == "P" + (id - 1)) {
                paginas[lugar].linha = i;
                paginas[lugar].coluna = j;
                lugar++;

            }

        }

    }

    //escreve no local livre
    for (var i = 0; i < paginas.length; i++) {
        cells = table.rows.item(paginas[i].linha).cells;
        cells.item(paginas[i].coluna).innerHTML = "-";
    }


}

function referenciarPagRam(id) {

    var table = document.getElementById('ram');
    var cells,
        lugar = 0;

    //encontra local livre
    for (var j = 0; j < 5; j++) {

        if (lugar == paginas.length)
            break;

        for (var i = 1; i <= 10; i++) {

            cells = table.rows.item(i).cells;

            if (lugar == paginas.length)
                break;

            if (cells.item(j).innerHTML == "-") {
                paginas[lugar].linha = i;
                paginas[lugar].coluna = j;
                lugar++;

            }

        }

    }

    if (lugar < 7)
        return;

    //escreve no local livre
    for (var i = 0; i < paginas.length; i++) {
        cells = table.rows.item(paginas[i].linha).cells;
        cells.item(paginas[i].coluna).innerHTML = "P" + (id - 1);
    }


}

function retirarPagDaRam(id) {

    var table = document.getElementById('ram');
    var cells,
        lugar = 0;

    //encontra local livre
    for (var j = 0; j < 5; j++) {

        if (lugar == paginas.length)
            break;

        for (var i = 1; i <= 10; i++) {

            cells = table.rows.item(i).cells;

            if (lugar == paginas.length)
                break;

            if (cells.item(j).innerHTML == "P" + (id - 1)) {
                paginas[lugar].linha = i;
                paginas[lugar].coluna = j;
                lugar++;

            }

        }

    }

    //escreve no local livre
    for (var i = 0; i < paginas.length; i++) {
        cells = table.rows.item(paginas[i].linha).cells;
        cells.item(paginas[i].coluna).innerHTML = "-";
    }

}

function pageFault() {

    var table = document.getElementById('disco');
    var cells,
        lugar = 0;

    //encontra local livre
    for (var j = 0; j < 13; j++) {

        if (lugar == paginas.length)
            break;

        for (var i = 1; i <= 7; i++) {

            cells = table.rows.item(i).cells;

            if (lugar == paginas.length)
                break;

            if (cells.item(j).innerHTML == "-") {
                //paginas[lugar].linha = i;
                //paginas[lugar].coluna = j;
                lugar++;

            }

        }

    }

    if (lugar < 7)
        return true;

    return false;
}

function referenciarProcessos(tempo) {

    for (var j = 0; j < processos.length; j++) {

        if (!processos[j].estaNoDisco && !processos[j].estaNaRam) {

            if (processos[j].tempo_chegada < tempo - 3 && processos[j].tempo_execucao > 0) {

                (function (j, tempo) {

                    setTimeout(function () {

                        if (!pageFault())
                            referenciarPagRam(processos[j].id);
                        referenciarPagDisco(processos[j].id);

                    }, 800 * tempo);
                })(j, tempo)

                processos[j].estaNaRam = processos[j].estaNoDisco = true;
            }

        }
    }
}

function pintarPaginas(id) {

    var table = document.getElementById('ram');
    var cells,
        lugar = 0;

    //encontra local livre
    for (var j = 0; j < 5; j++) {

        if (lugar == paginas.length)
            break;

        for (var i = 1; i <= 10; i++) {

            cells = table.rows.item(i).cells;

            if (lugar == paginas.length)
                break;

            if (cells.item(j).innerHTML == "P" + (id - 1)) {
                paginas[lugar].linha = i;
                paginas[lugar].coluna = j;
                lugar++;

            }

        }

    }

    if(lugar < 7)
        return false;

    //escreve no local livre
    for (var i = 0; i < paginas.length; i++) {
        cells = table.rows.item(paginas[i].linha).cells;
        cells.item(paginas[i].coluna).style.backgroundColor = "green";
    }

    return true;
}

function descolorirPagRam(id) {


    var table = document.getElementById('ram');
    var cells,
        lugar = 0;

    //encontra local livre
    for (var j = 0; j < 5; j++) {

        if (lugar == paginas.length)
            break;

        for (var i = 1; i <= 10; i++) {

            cells = table.rows.item(i).cells;

            if (lugar == paginas.length)
                break;

            if (cells.item(j).innerHTML == "P" + (id - 1)) {
                paginas[lugar].linha = i;
                paginas[lugar].coluna = j;
                lugar++;

            }

        }

    }

    //escreve no local livre
    for (var i = 0; i < paginas.length; i++) {
        cells = table.rows.item(paginas[i].linha).cells;
        cells.item(paginas[i].coluna).style.backgroundColor = "white";
    }


}

function pintarGrafico(id_processo, tempo) {

    (function (id_processo, tempo) {
        setTimeout(function () {

            cells = table.rows.item(processos[id_processo].id).cells;

            cells.item(tempo).style.backgroundColor = "blue";

            if(!pintarPaginas(processos[id_processo].id)){
                referenciarPagRam(processos[id_processo].id);
                pintarPaginas(processos[id_processo].id);
            }

        }, 800 * tempo);
    })(id_processo, tempo)
}

function pintarSobrecarga(id_processo, tempo){

    (function (id_processo, tempo) {
        setTimeout(function () {

            cells = table.rows.item(processos[id_processo].id).cells;

            cells.item(tempo).style.backgroundColor = "red";

        }, 800 * tempo);
    })(id_processo, tempo)
}

function retirarProcessoRamDisco(id_processo, tempo) {

    (function (id_processo, tempo) {

        setTimeout(function () {
            descolorirPagRam(processos[id_processo].id);
        }, 800 * tempo);

        if (escalonamento == "SJF" || escalonamento == "FIFO") {

            setTimeout(function () {
                retirarPagDaRam(processos[id_processo].id);
            }, 800 * tempo);

            setTimeout(function () {
                retirarPagDisco(processos[id_processo].id);
            }, 800 * tempo);
        }

    })(id_processo, tempo)

}

function fifo() {

    processos.sort(function (a, b) {

        if (a.tempo_chegada > b.tempo_chegada) {
            return 1;
        }

        if (a.tempo_chegada < b.tempo_chegada) {
            return -1;
        }

        return 0;
    });


    table = document.getElementById('gantt');

    tempo_real = table.createCaption();

    var soma = 4;
    var execucoes = 4;
    var tempo = 4;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }

    while (soma > execucoes) {

        referenciarProcessos(tempo);

        var id_processo = procurarProcesso(tempo);

        if (id_processo != -1 && processos[id_processo].tempo_execucao > 0) {

            processos[id_processo].executando = true;

            pintarGrafico(id_processo, tempo);

            processos[id_processo].tempo_execucao--;

            if (processos[id_processo].tempo_execucao == 0) {

                retirarProcessoRamDisco(id_processo, tempo);
            }

            execucoes++;
        }

        (function (tempo) {

            setTimeout(function () {
                tempo_real.innerHTML = "Tempo: " + (tempo - 3);
            }, 800 * tempo);
        })(tempo)



        tempo++;
    }

}

function sjf() {

    processos.sort(function (a, b) {

        if (a.tempo_chegada > b.tempo_chegada) {
            return 1;
        }

        if (a.tempo_chegada < b.tempo_chegada) {
            return -1;
        }

        return 0;
    });

    table = document.getElementById('gantt');

    tempo_real = table.createCaption();

    var soma = 4;
    var execucoes = 4;
    var tempo = 4;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }

    while (soma > execucoes) {

        referenciarProcessos(tempo);

        var id_processo = procurarProcesso(tempo);

        if (id_processo != -1 && processos[id_processo].tempo_execucao > 0) {

            processos[id_processo].executando = true;

            pintarGrafico(id_processo, tempo);

            processos[id_processo].tempo_execucao--;

            if (processos[id_processo].tempo_execucao == 0) {

                retirarProcessoRamDisco(id_processo, tempo);

                processos[id_processo].executando = false;
            }

            execucoes++;
        }

        (function (tempo) {

            setTimeout(function () {
                tempo_real.innerHTML = "Tempo: " + (tempo - 3);
            }, 800 * tempo);
        })(tempo)

        tempo++;
    }

}

function procurarProcesso(tempo_atual) {

    var min = 999;
    var index = -1;

    if (escalonamento == "FIFO" || escalonamento == "Round Robin") {

        for (i = 0; i < processos.length; i++) {

            if (processos[i].tempo_chegada < tempo_atual - 3 && processos[i].tempo_execucao > 0) {

                index = i;
                break;
            }

        }

        return index;
    }

    if (escalonamento == "Round Robin") {

        for (i = 0; i < processos.length; i++) {

            if (processos[i].tempo_chegada < tempo_atual - 3 && processos[i].tempo_execucao > 0) {

                index = i;
                break;
            }

        }

        return index;
    }

    if (escalonamento == "SJF") {

        for (i = 0; i < processos.length; i++) {

            if (processos[i].visitado)
                continue;

            if (processos[i].executando) {
                index = i;
                break;
            }

            if (processos[i].tempo_chegada < tempo_atual - 3 && processos[i].tempo_execucao > 0) {

                if (processos[i].tempo_execucao < min) {

                    min = processos[i].tempo_execucao;

                    index = i;
                }
            }

        }

        if (index != -1)
            processos[index].executando = true;

        return index;
    }

    //EDF
    for (i = 0; i < processos.length; i++) {

        if (!processos[i].visitado) {

            if (processos[i].tempo_chegada < tempo_atual - 3) {

                if (processos[i].deadline < min) {

                    min = processos[i].deadline;

                    index = i;
                }
            }

        }
    }

    return index;

}

function roundRobin() {

    /*processos.sort(function (a, b) {

        if (a.tempo_chegada > b.tempo_chegada) {
            return 1;
        }

        if (a.tempo_chegada < b.tempo_chegada) {
            return -1;
        }

        return 0;
    });

    var table = document.getElementById('gantt');

    tempo_real = table.createCaption();

    var soma = 4;
    var execucoes = 4;
    var tempo = 4;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }

    while (soma > execucoes) {

        referenciarProcessos(tempo);

        var id_processo = procurarProcesso(tempo);

        if (id_processo != -1 && processos[id_processo].tempo_execucao > 0) {

           // if(quantum == 0){

             //   pintarSobrecarga(id_processo, tempo);
               // quantum = parseInt(document.getElementById("quantum").value);
                //processos[id_processo].executando = false;
                //processos[id_processo].rr = true;
                //continue;
            //}

            processos[id_processo].executando = true;

            pintarGrafico(id_processo, tempo);

            processos[id_processo].tempo_execucao--;
            quantum--;

            if (processos[id_processo].tempo_execucao == 0) {

                retirarProcessoRamDisco(id_processo, tempo);
            }

            execucoes++;
        }

        (function (tempo) {

            setTimeout(function () {
                tempo_real.innerHTML = "Tempo: " + (tempo - 3);
            }, 800 * tempo);
        })(tempo)



        tempo++;
    }*/
    
    var quantum_atual = quantum = parseInt(document.getElementById("quantum").value);
    sobrecarga = parseInt(document.getElementById("sobrecarga").value);

    processos.sort(function (a, b) {

        if (a.tempo_chegada > b.tempo_chegada) {
            return 1;
        }

        if (a.tempo_chegada < b.tempo_chegada) {
            return -1;
        }

        return 0;
    });


    table = document.getElementById('gantt');

    tempo_real = table.createCaption();

    var soma = 4;
    var execucoes = 4;
    var tempo = 4;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }

    while (soma > execucoes) {

        referenciarProcessos(tempo);

        var id_processo = procurarProcesso(tempo);

        if (id_processo != -1 && processos[id_processo].tempo_execucao > 0) {

            if(quantum_atual == 0){

                   pintarSobrecarga(id_processo, tempo);
                   quantum_atual = quantum;
                   //processos[id_processo].executando = false;
                   //processos[id_processo].rr = true;
                   tempo++;
                   continue;
            }

            processos[id_processo].executando = true;

            pintarGrafico(id_processo, tempo);

            processos[id_processo].tempo_execucao--;

            if (processos[id_processo].tempo_execucao == 0) {

                retirarProcessoRamDisco(id_processo, tempo);
            }

            quantum_atual--;
            execucoes++;
        }

        (function (tempo) {

            setTimeout(function () {
                tempo_real.innerHTML = "Tempo: " + (tempo - 3);
            }, 800 * tempo);
        })(tempo)



        tempo++;
    }

}





function edf() {

    quantum = parseInt(document.getElementById("quantum").value);
    sobrecarga = parseInt(document.getElementById("sobrecarga").value);

    processos.sort(function (a, b) {

        if (a.deadline > b.deadline) {
            return 1;
        }
        if (a.deadline < b.deadline) {
            return -1;
        }

        return 0;
    });

    var table = document.getElementById('gantt');

    var tempo_atual = 4;

    var i = 0;
    var cells;
    var cellLength;
    var soma = 0;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }

    while (soma > 0) {
        var i = 0;

        while (i < processos.length) {

            m = procurarProcesso(tempo_atual);

            if (m != -1) {


                if (processos[m].tempo_execucao > 0 && processos[m].tempo_chegada < tempo_atual - 3) {


                    if (quantum > processos[m].tempo_execucao)
                        cellLength = tempo_atual + processos[m].tempo_execucao;
                    else
                        cellLength = tempo_atual + quantum;

                    for (j = tempo_atual; j < cellLength; j++) {

                        (function (m, index) {

                            setTimeout(function () {

                                cells = table.rows.item(processos[m].id).cells;

                                cells.item(index).style.backgroundColor = "blue";

                            }, 350 * j);
                        })(m, j)


                        if (j == cellLength - 1) {

                            for (k = j + 1; k < cellLength + sobrecarga; k++) {

                                (function (m, index, tExecucao) {

                                    setTimeout(function () {

                                        cells = table.rows.item(processos[m].id).cells;

                                        if (tExecucao - quantum > 0) {
                                            cells.item(index).style.backgroundColor = "red";
                                        }

                                    }, 350 * (k));
                                })(m, k, processos[m].tempo_execucao)

                            }

                        }

                    }

                    if (quantum > processos[m].tempo_execucao)
                        soma -= processos[m].tempo_execucao;
                    else
                        soma -= quantum;

                    processos[m].tempo_execucao -= quantum;

                    if (processos[m].tempo_execucao > 0)
                        tempo_atual = cellLength + sobrecarga;
                    else {
                        tempo_atual = cellLength;
                        processos[m].visitado = true;
                    }


                }

                else
                    tempo_atual++;


            }

            else
                tempo_atual++;


            i++;
        }

    }




}

function escalonarProcessos() {

    escalonamento = document.getElementById("escalonamentos").value;

    switch (escalonamento) {

        case "FIFO":
            fifo();
            break;

        case "SJF":
            sjf();
            break;

        case "Round Robin":
            roundRobin();
            break;

        case "EDF":
            edf();
            break;

    }

}

function iniciar() {

    deletarFields();

    criarGraficoDeGantt();

    criarDisco();
    criarRam();

    escalonarProcessos();
}