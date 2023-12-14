class Tabuleiro{
	constructor(linhas,colunas){
		this.colunas = colunas;
		this.linhas = linhas;
		this.tabuleiro1 = new Array();
		this.limpar_tabuleiro();
		this.criar_tabuleiro();
	}

	limpar_tabuleiro(){
		const tab = document.getElementById("tab");
        tab.innerHTML = '';
	}

	criar_tabuleiro(){
		this.tab = document.getElementById("tab");
		tab.setAttribute("style", "grid-template-columns:"+"auto ".repeat(this.colunas));
		for(var linha = 1; linha<=this.linhas; linha++) {
			this.tabuleiro1[linha] = new Array();
			for(var coluna = 1; coluna<=this.colunas; coluna++) {
				const bloco = document.createElement("div");
				bloco.classList.add('bloco');
				bloco.setAttribute("id", "b"+linha+coluna);
				bloco.setAttribute("ondrop", "drop(event)"); 
                bloco.setAttribute("ondragover", "allowDrop(event)");
				tab.appendChild(bloco);

				this.tabuleiro1[linha][coluna] = undefined;
			}
		}
	}
	
}