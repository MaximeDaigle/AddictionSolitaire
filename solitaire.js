//Fait par Maxime Daigle

var init = function(){
    document.getElementById("b").innerHTML = grille(4, 13, cards, sDeck);
    removeAce();
    document.getElementById("b").innerHTML += dessousGrille();
};

var deck = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];

var nbBr = 3;  //nombre de brassage encore possible

var trous = []; //contient tous les trous

//mélange le paquet de cartes
var shuffle = function(deck2Shuffle){
    var shuffled = deck2Shuffle;
    for (i = deck2Shuffle.length-1; i > 0; i--) {
		var temporaire = shuffled[i];
		var randomCard = Math.floor(Math.random() * (i + 1));
		shuffled[i] = shuffled[randomCard];
		shuffled[randomCard] = temporaire;
    }
    return shuffled;
};

var sDeck = shuffle(deck.slice());  //shuffled deck

//crée la grille de carte
var grille = function(nbLigne, nbCase, cards, sDeck){
    var resultat = ['\ ', '<table>\ '];
    for(var i = 0; i < nbLigne; i++){
	var c = nbCase*i;             //index de la carte dans le deck shuffled (sDeck)
	resultat.push( ligneGrille(nbCase, cards, sDeck, c) );
    }
    resultat.push('</table>');
    return resultat.join("\n");
};

//crée une ligne de la grille de carte
var ligneGrille = function(nbCase, cards, sDeck, c){
    var result = ['<tr>\ '];
    for( var i = 0; i < nbCase; i++ ){
	//place les noms des cartes dans le tableau dans le même ordre qu'ils apparaissent dans sDeck
	result.push('<td id='+ "" + c + ' onclick="movClick('+c+');"><img src=' + cards[sDeck[c++]] + '></td>\ ');
    }
    result.push('</tr>\ ');
    return result.join("\n");
};


//construit le dessous de grille
var dessousGrille = function(){
    if(winCheck()){ //si le joueur a gagné
	return "<br> Vous avez réussi! Bravo! <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>";
    }
    if(checkPosMove()){
	if(nbBr > 0){
	    //brassages et mouvements possibles
	    return "<br> Vous pouvez encore <button onclick='brClick();'>Brasser les cartes</button> " 
		+ nbBr 
                + " fois <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>";
	}else{
	    //pas de brassages mais mouvements possibles
	    return "<br> Vous ne pouvez plus brasser les cartes <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>";
	}
    }else{
	if(nbBr > 0){
	    //brassages mais pas de mouvement possible
	    return  "<br> Vous devez <button onclick='brClick();'>Brasser les cartes</button>  <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>";
	}else{
	    //pas de brassage et pas de mouvement possible
	    return "<br> Vous n'avez pas réussi à placer toutes les cartes... Essayer à nouveau! <br><br> "
        	  +"<button onclick='newGameClick()'>Nouvelle partie</button>";
	}
    }
};

//vérifie s'il y a des mouvements possibles
var checkPosMove = function(){
    if(document.getElementsByClassName("movable").length == 0){  //si aucun élément est marqué comme bougeable
	return false;
    }
    return true;
};

//check si le joueur a gagné
var winCheck = function(){
    if(quickWinCheck() < 4){ //commence par verifier si les 4 trous sont à la fin des lignes 
	return false         //si moins de 4 trous placés correctement, pas besoins de verifier plus de cartes
    }
    var nbLigneC = 0;       //nombre de ligne complète
    for(var i = 0; i < 4; i++){  //pour chaque ligne de la grille
    	var carte2 = 4;
	var lignePreC = true; //ligne précédente complète
	while(carte2 <= 7 && lignePreC){  //regarde pour chaque carte de 2
    	    if(sDeck[i*13] == carte2){ //si elle est placée correctement
            	var j = 0;
		
		while(carte2 + 4*j == sDeck[i*13+j]){ //tant que les cartes sont en ordre
               	    j++;                             //compte le nombre de carte de suite en ordre
                    if(j == 12){ 
                        nbLigneC++; 
                        break;       //si la ligne est complètement en ordre, passer à la prochaine ligne
		    } 
            	}
                if( j < 12){
		    lignePreC = false; //arrêter de vérifier pour une victoire si une ligne n'est pas complète
		}
    		break; //arrête de chercher si une carte2 est placée dans cette case
            }
    	    carte2++;  //prochaine carte de 2
    	}
    }
    if(nbLigneC == 4){
	return true;
    }else{
	return false;
    }
};

//vérifie si les trous sont bien placés pour une victoire potentielle
var quickWinCheck = function(){
    var trousPlacer = 0;   //compte le nombre de trous placés correctement à la fin d'une ligne
    for(var i = 0; i < trous.length; i++){
	if(trous[i]%13 == 12){
	    trousPlacer++;
	}
    }
    return trousPlacer;
};


//mélange les cartes en gardant le progrès
var savedProgShuf = function(){
    var tabMem = [[],[],[],[]]; //tableau mémoire
    var decale = 0;

    for(var i = 0; i < 4; i++){  //pour chaque ligne de la grille
    	var carte2 = 4;

	while(carte2 <= 7){      //regarde pour chaque carte de 2
    	    if(sDeck[i*13-decale] == carte2){ //si elle est placée
            	var j = 0;

		while(carte2 + 4*j == sDeck[i*13+j-decale]){
               	    j++;       //compte le nombre de carte de suite en ordre
            	}
        	tabMem[i] = (sDeck.splice(i*13-decale, j));   //enlève la suite ordonnée et la mémorise
		decale += j;                       //compense le décalage de l'index causé par le retrait des valeurs dans sDeck
    		break;                             //arrête de chercher si une carte2 est placée dans cette case
            }
    	    carte2++;         //prochaine carte de 2
    	}
    }
    sDeck = shuffle(sDeck);  //shuffle les cartes restantes
    var k = 0;

    for(var i = 0; i < 4; i++){        //pour chaque lignes	
    	while(tabMem[i].length < 13){  //remplir les lignes avec les carte brassées
            tabMem[i].push(sDeck[k++]);
    	}
    }
    return tabMem[0].concat(tabMem[1],tabMem[2],tabMem[3]);  //renvoie le nouveau tableau de jeu avec les cartes non placées brassées
};


//effet de clicker sur le bouton brasser les cartes
var brClick = function(){
    nbBr--;
    if(nbBr >= 0){
	removeMark();
	trous = [];
	sDeck = savedProgShuf();//brasse sans toucher les cartes placées correctement
    }
    init();
};

//Crée une nouvelle partie
var newGameClick = function(){
    removeMark();             //enlève tous les class et la coloration
    trous = [];               //enlève les trous
    sDeck = shuffle(deck.slice());       //rebrasse le paquet
    nbBr = 3;                //reset le nombre de brassage permis
    init();
};


//déplace la carte à la case id dans le trou approprié
var movClick = function(id){
    if(document.getElementById(id).className == "movable"){
	var nomCarte = document.getElementById(id).innerHTML.split('"')[1];  //nom de la carte à bouger
	var nbCarte = cards.indexOf(nomCarte);         //nombre représentant la carte à la case id
	var idTrou = sDeck.indexOf(nbCarte-4) + 1;     //idTrou est une case à droite de la carte ayant une valeur plus petite de 1 de la même couleur

	if(nbCarte == 4 || nbCarte == 5 || nbCarte == 6 || nbCarte == 7){  //si la carte déplacée est un 2
	    deplace2(id, nbCarte, nomCarte);   //bouge la carte 2
	}else{   
	    deplaceA(id, idTrou, nbCarte, nomCarte);  //si la carte déplacée est une autre carte qu'un 2
	}
	removeMark();
	upMarkMovable();                  //mets à jour les cartes movable selon le nouveau trou
	if(!checkPosMove()){              //si plus de mouvement possible, mettre à jour le message en dessous de la grille
	    trous = [];
	    init();
	}
    }
};

//bouger la carte 2 dans la 1ère colonne (dans la case vide la plus haute)
var deplace2 = function(id, nbCarte, nomCarte){
    for( var i = 0; i < 4 ; i++){   //regarde les cases de haut en bas
	if(document.getElementById((i*13)).innerHTML == ""){   //si la case est vide, déplacer la carte et arrêter de chercher
	    document.getElementById((i*13)).innerHTML = '<img src=' + nomCarte + '>';
	    document.getElementById(id).innerHTML = "";     //la case contenant la carte qui a été bougée devient vide

	    //pour les autres 2 qui n'ont pas été bougées
	    for(var j = 4; j < 8 ; j++){
		var id2s = sDeck.indexOf(j);
		document.getElementById(id2s).style.backgroundColor = "transparent"; //enlève couleur lime sur les autres 2
		document.getElementById(id2s).className = "";                        //enlève la classe movable
	    }
	    var nbAs = sDeck[i*13];  //nombre représentant l'as
	    sDeck[i*13] = nbCarte;                        //mets à jour sDeck en mettant le nombre de la carte qui a été deplacé à la place de l'as
	    sDeck[id] = nbAs;                             //mets à jour sDeck en mettant l'as au nouveau trou
	    trous.splice(trous.indexOf(i*13),1,id);       //mets à jour les trous
	    break;
	}
    }
};

//bouge autre carte dans le trou approprié
var deplaceA = function(id, idTrou, nbCarte, nomCarte){
    document.getElementById(idTrou).innerHTML = '<img src=' + nomCarte + '>'; //remplace trou par la carte movable cliquée
    document.getElementById(id).innerHTML = "";    //la case contenant la carte qui a été bougée devient vide
    document.getElementById(id).style.backgroundColor = "transparent"; //enlève couleur lime sur nouveau trou
    document.getElementById(id).className = "";   //enlève la class movable au nouveau trou
    
    var nbAs = sDeck[idTrou];                        //nombre représentant l'as
    sDeck[idTrou] = nbCarte;                         //mets à jour sDeck en mettant le nombre de la carte qui a été deplacéa à la place de l'as
    sDeck[id] = nbAs;                                //mets à jour sDeck en mettant l'as au nouveau trou
    trous.splice(trous.indexOf(idTrou),1,id);        //mets à jour les trous
};


//enlève les as de la grille
var removeAce = function(){
    for( var i = 0; i < 4; i++ ){    //pour tous les as
	var id = sDeck.indexOf(i);   //prend l'index de la carte
	document.getElementById(id).innerHTML = "" ;  //remplace l'as par du vide
	trous.push(id);
    }
    upMarkMovable();
};

//update tous les mark selon chacun des trous
var upMarkMovable = function(){
    trous.map(function(trou){ return markMovable(trou);});
};

//avec le id du trou, mark as movable et colore en lime les cartes qui peuvent être déplacées
var markMovable = function(id){
    if(id % 13 == 0){ //si trou dans 1ère colonne, colorer tous les cartes 2
	for(var j = 0; j < 4; j++){
	    var id2s = sDeck.indexOf(j+4);                 //id des cartes 2
	    document.getElementById(id2s).style.backgroundColor = "lime";
	    document.getElementById(id2s).className = "movable";
	}
    }else if(sDeck[id-1] > 3 && sDeck[id-1] < 48){   //si la carte à gauche du trou n'est pas un as ou un roi
	    var coteTrou = document.getElementById((id - 1)).innerHTML.split('"')[1];  //carte à gauche du trou
	    var nbCoteTrou = cards.indexOf(coteTrou);       //nombre représentant la carte à coté du trou
	    var idLime = sDeck.indexOf(nbCoteTrou + 4);          //id de la carte qui doit être colorée lime
	    document.getElementById(idLime).style.backgroundColor = "lime";    //movable card devient lime
	    document.getElementById(idLime).className = "movable";             //donne class movable 
    }
};

//enlève les marques et la coloration
var removeMark = function(){
    for(var i = 0; i < 52; i++){
	document.getElementById(i).style.backgroundColor = "transparent";
	document.getElementById(i).className = "";
    }
};


var assert = function(test, message){
    if(!test){
       throw new Error(message + " failed");
    }
};

var testTp2 = function(){
    testLigneGrille();
    testGrille();
    testDessousGrille();
    testSavedProgShuf();
    testWinCheck();
    testQuickWinCheck();
};

var testLigneGrille = function(){
    //ligne de 4 cases avec cartes ordonnées
    var testDeck =  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
    assert(ligneGrille(4, cards, testDeck, 0) == "<tr> \n<td id=0 onclick=\"movClick(0);\"><img src=cards/AC.svg></td> "
                                                +"\n<td id=1 onclick=\"movClick(1);\"><img src=cards/AD.svg></td> "
           					+"\n<td id=2 onclick=\"movClick(2);\"><img src=cards/AH.svg></td> "
           					+"\n<td id=3 onclick=\"movClick(3);\"><img src=cards/AS.svg></td> \n</tr> ", "testLigneGrille ordonnee");
    
    //ligne de 6 cases avec cartes désordonnées à partir de la 13e carte du deck
	var testDeck =  [32,20,47,16,17,50,19,14,1,22,23,24,2,15,21,25,35,11,43,6,7,8,9,10,4,12,26,27,28,29,30,31,13,33,34,3,36,37,38,39,40,41,42,5,44,45,46,0,48,49,18,51];
    assert(ligneGrille(6, cards, testDeck, 13) == "<tr> \n<td id=13 onclick=\"movClick(13);\"><img src=cards/4S.svg></td> "
           					 +"\n<td id=14 onclick=\"movClick(14);\"><img src=cards/6D.svg></td> "
           					 +"\n<td id=15 onclick=\"movClick(15);\"><img src=cards/7D.svg></td> "
           					 +"\n<td id=16 onclick=\"movClick(16);\"><img src=cards/9S.svg></td> "
          					 +"\n<td id=17 onclick=\"movClick(17);\"><img src=cards/3S.svg></td> "
          					 +"\n<td id=18 onclick=\"movClick(18);\"><img src=cards/JS.svg></td> \n</tr> ", "testLigneGrille desordonnee");
};

var testGrille = function(){  
    //grille de 2 lignes par 3 colonnes avec cartes ordonnées
    var testDeck =  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
    assert(grille(2, 3, cards, testDeck) == " \n<table> \n<tr> "
           				   +"\n<td id=0 onclick=\"movClick(0);\"><img src=cards/AC.svg></td> "
                                           +"\n<td id=1 onclick=\"movClick(1);\"><img src=cards/AD.svg></td> "
           				   +"\n<td id=2 onclick=\"movClick(2);\"><img src=cards/AH.svg></td> "
           			       	   +"\n</tr> \n<tr> "
           				   +"\n<td id=3 onclick=\"movClick(3);\"><img src=cards/AS.svg></td> "
           				   +"\n<td id=4 onclick=\"movClick(4);\"><img src=cards/2C.svg></td> "
           				   +"\n<td id=5 onclick=\"movClick(5);\"><img src=cards/2D.svg></td> "
           				   +"\n</tr> \n</table>", "testGrille ordonnee" );
    
    //grille de 3 lignes par 2 colonnes avec cartes désordonnées
    var testDeck =  [32,20,47,16,17,50,19,14,1,22,23,24,2,15,21,25,35,11,43,6,7,8,9,10,4,12,26,27,28,29,30,31,13,33,34,3,36,37,38,39,40,41,42,5,44,45,46,0,48,49,18,51];
    assert(grille(3, 2, cards, testDeck) == " \n<table> \n<tr> "
           				   +"\n<td id=0 onclick=\"movClick(0);\"><img src=cards/9C.svg></td> "
           				   +"\n<td id=1 onclick=\"movClick(1);\"><img src=cards/6C.svg></td> "
           				   +"\n</tr> \n<tr> "
           				   +"\n<td id=2 onclick=\"movClick(2);\"><img src=cards/QS.svg></td> "
           				   +"\n<td id=3 onclick=\"movClick(3);\"><img src=cards/5C.svg></td> "
           				   +"\n</tr> \n<tr> "
           				   +"\n<td id=4 onclick=\"movClick(4);\"><img src=cards/5D.svg></td> "
           				   +"\n<td id=5 onclick=\"movClick(5);\"><img src=cards/KH.svg></td> "
           				   +"\n</tr> \n</table>", "testGrille desordonnee");
};

var testDessousGrille = function(){
    //avec positions des cartes gagnantes
    sDeck = [4,8,12,16,20,24,28,32,36,40,44,48,3,5,9,13,17,21,25,29,33,37,41,45,49,2,6,10,14,18,22,26,30,34,38,42,46,50,1,7,11,15,19,23,27,31,35,39,43,47,51,0];
    trous = [12,25,38,51];
    assert(dessousGrille() == "<br> Vous avez réussi! Bravo! <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>", "testDessousGrille, victoire");

    //brassage possible et mouvement possible
    sDeck = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
    nbBr = 3;
    assert( dessousGrille() == "<br> Vous pouvez encore <button onclick='brClick();'>Brasser les cartes</button> " 
                             + "3 fois <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>", "testDessousGrille, brasse + mouvement possible");

    //pas de brassage mais mouvement possible
    sDeck = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
    nbBr = 0;
    assert( dessousGrille() == "<br> Vous ne pouvez plus brasser les cartes <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>",
	                       "testDessousGrille, 0 brassage + mouvement possible");

    //reste brassage, mais pas de mouvement possible
    sDeck = [51,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,0];
    nbBr = 3;
    removeMark();
    assert( dessousGrille() =="<br> Vous devez <button onclick='brClick();'>Brasser les cartes</button> "
	                     +" <br><br> <button onclick='newGameClick()'>Nouvelle partie</button>","testDessousGrille, brassage mais pas de mouvement");

    //Perdu
    sDeck = [51,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,0];
    nbBr = 0;
    removeMark();
    assert( dessousGrille() == "<br> Vous n'avez pas réussi à placer toutes les cartes... Essayer à nouveau! <br><br> "
                              +"<button onclick='newGameClick()'>Nouvelle partie</button>", "testDessousGrille, perdu");

};

var testSavedProgShuf = function(){
    //avec position des cartes gagnantes
    sDeck = [4,8,12,16,20,24,28,32,36,40,44,48,3,5,9,13,17,21,25,29,33,37,41,45,49,2,6,10,14,18,22,26,30,34,38,42,46,50,1,7,11,15,19,23,27,31,35,39,43,47,51,0];
    var testDeck = sDeck.slice().toString();
    var deckAfter = savedProgShuf().toString();
    assert( deckAfter[0] == testDeck[0], "testSavedProgShuf gagnant, 1ere case, 1ere ligne");
    assert( deckAfter[13] == testDeck[13], "testSavedProgShuf gagnant, 1ere case, 2e ligne");
    assert( deckAfter[26] == testDeck[26], "testSavedProgShuf gagnant, 1ere case, 3e ligne");
    assert( deckAfter[39] == testDeck[39], "testSavedProgShuf gagnant, 1ere case, 4e ligne");
    assert( deckAfter[11] == testDeck[11], "testSavedProgShuf gagnant, derniere case, 1ere ligne");
    assert( deckAfter[37] == testDeck[37], "testSavedProgShuf gagnant, derniere case, 3e ligne");
    assert( deckAfter[34] == testDeck[34], "testSavedProgShuf gagnant, case au milieu, 3e ligne");
};

var testWinCheck = function (){
    //position cartes gagnantes
    sDeck = [4,8,12,16,20,24,28,32,36,40,44,48,3,5,9,13,17,21,25,29,33,37,41,45,49,2,6,10,14,18,22,26,30,34,38,42,46,50,1,7,11,15,19,23,27,31,35,39,43,47,51,0];
    assert(winCheck() == true, "testWinCheck cartes gagnantes");

    //cartes désordonnées
    sDeck = [32,20,47,16,17,50,19,14,1,22,23,24,2,15,21,25,35,11,43,6,7,8,9,10,4,12,26,27,28,29,30,31,13,33,34,3,36,37,38,39,40,41,42,5,44,45,46,0,48,49,18,51];
    assert(winCheck() == false, "testWinCheck cartes désordonnées");
};

var testQuickWinCheck = function(){
    //trous tous placés
    trous = [25,12,51,38];
    assert(quickWinCheck() == 4, "testQuickWinCheck, victoire");
    
    //2 trous placés
    trous = [3,51,25,44];
    assert(quickWinCheck() == 2, "testQuickWinCheck, 2 trous placés");
    
    //0 trous placés
    trous = [32,11,18,44];
    assert(quickWinCheck() == 0, "testQuickWinCheck, 0 trous placés");
};

var cards = ['cards/AC.svg',
	     'cards/AD.svg',
	     'cards/AH.svg',
	     'cards/AS.svg',
	     'cards/2C.svg',
	     'cards/2D.svg',
	     'cards/2H.svg',
	     'cards/2S.svg',
	     'cards/3C.svg',
	     'cards/3D.svg',
	     'cards/3H.svg',
	     'cards/3S.svg',
	     'cards/4C.svg',
	     'cards/4D.svg',
	     'cards/4H.svg',
	     'cards/4S.svg',
	     'cards/5C.svg',
	     'cards/5D.svg',
	     'cards/5H.svg',
	     'cards/5S.svg',
	     'cards/6C.svg',
	     'cards/6D.svg',
	     'cards/6H.svg',
	     'cards/6S.svg',
	     'cards/7C.svg',
	     'cards/7D.svg',
	     'cards/7H.svg',
	     'cards/7S.svg',
	     'cards/8C.svg',
	     'cards/8D.svg',
	     'cards/8H.svg',
	     'cards/8S.svg',
	     'cards/9C.svg',
	     'cards/9D.svg',
	     'cards/9H.svg',
	     'cards/9S.svg',
	     'cards/10C.svg',
	     'cards/10D.svg',
	     'cards/10H.svg',
	     'cards/10S.svg',
	     'cards/JC.svg',
	     'cards/JD.svg',
	     'cards/JH.svg',
	     'cards/JS.svg',
	     'cards/QC.svg',
	     'cards/QD.svg',
	     'cards/QH.svg',
	     'cards/QS.svg',
	     'cards/KC.svg',
	     'cards/KD.svg',
	     'cards/KH.svg',
	     'cards/KS.svg'];
