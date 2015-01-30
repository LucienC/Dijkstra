window.onload=function(){
	 var depart = prompt("Arret de départ :", 'Lettre entre A et J');
	 var arrive = prompt("Arret d'arrivé' :", 'Lettre entre A et J');
	 depart = depart.toUpperCase();
	 arrive = arrive.toUpperCase();
      if (depart!=null && arrive!=null && depart.length == 1 && arrive.length == 1 && isNaN(depart) && isNaN(arrive)) {
      	   _cn("img",{src:'./img/wiki.png', alt: "Schema du réseau"},{},_tn('body')[0]);//Utlilisation de la bibliothèque MIW qui est mise à jour régulièrement
      	   _cn('div',{id:'matrice'},{},_tn('body')[0]);
      	   _cn('div',{id:'poid'},{},_tn('body')[0]);
      	   _cn('div',{id:'trajet'},{},_tn('body')[0]);
           init(depart,arrive);
       }else{
       		alert('Veuillez recharger la page et entrer des valeurs correctes: \n Une lettre entre A et J');
       }
}


function init(dep,arr){
	/*d=Arrêt de Départ a= Arrêt d'arrivé  l=Distance entre les deux arrêts 
	Exemple d'un JSON qu'on pourrait récupérer depuis la base de données pour connaitre le trajet le plus court/rapide
	Utilisation du jeu d'essai de la page wikipédia pour réaliser mes tests : http://fr.wikipedia.org/wiki/Algorithme_de_Dijkstra
	*/

	arrets = [{'d':'A','a':'B','l':85},
			 {'d':'A','a':'C','l':217},
			 {'d':'A','a':'E','l':173},
			 {'d':'B','a':'F','l':80},
			 {'d':'C','a':'G','l':186},
			 {'d':'C','a':'H','l':103},
			 {'d':'H','a':'D','l':183},
			 {'d':'F','a':'I','l':250},
			 {'d':'H','a':'J','l':167},
			 {'d':'E','a':'J','l':502},
			 {'d':'I','a':'J','l':84}];


//Fontion qui va extraire tout les arrêts sans doublon
	function extractArret(array) {
	  var i, j, len = array.length, out = [], obj = {},tabPoid = [];;
	  for (i = 0; i < len; i++) {
	    obj[array[i].d] = 0;
	    obj[array[i].a] = 0;
	  }
	  out.push('');//Ajout d'une valeur vide pour l'affichage de la table
	  for (j in obj) {
	  	if(j!='extend'){
	  		out.push(j);
		}
	  }
	  return out.sort();
	}

	var xy = extractArret(arrets);

	//Un simple affichage de la matrice des arcs orientés correspondant	
	var i,j,k,b;
	var tab = '';
		tab += '<table>';
   		tab += '<caption>Matrices des arcs orientés</caption>';

	for(i = 0; i < xy.length; i++){

			tab += '<tr>'
     		tab += '<th>'+xy[i]+'</th>';//Lignes		
     	
     	for(j = 1; j < xy.length; j++){
     		//Colonnes
     		if(i==0){
     			tab += '<td><b>'+xy[j]+'</b></td>';//Si c'est la première ligne
     		}else{
     			if(xy[i] == xy [j]){
     				tab += '<td>0</td>';
     			}else{
     				b=false;
     				k=0;
     				while(k < arrets.length && !b){
	     				if(arrets[k].d == xy[i] && arrets[k].a == xy[j] || arrets[k].a == xy[i] && arrets[k].d == xy[j]){
	     					tab += '<td>'+arrets[k].l+'</td>';
	     					b=true;
	     				}
	     				k++;
					}
					if(!b){
						tab += '<td>-</td>';
					}
     			}
     		}
     	}     	
     	tab += '</tr>';
	}
	tab += '</table>';
	document.getElementById('matrice').innerHTML = tab;
	xy.splice(0, 1);//Suppression de la valeur vide pour l'algorithme de Dijkstra
	dijkstra(xy,arrets,dep,arr);
}


//Function Algorithme de Dijsktra
function dijkstra(listArret,graph,depart,arrive){
	var k=0;

	//Fonction qui va créer la table des poids des arrets
	function createTabPoid(array){
		var tabPoid = [];
		for(var i=0; i<array.length; i++){
		    tabPoid.push([array[i],10000,0,""]);
		  }
		  return tabPoid;
	}

	var tabPoid = createTabPoid(listArret);


	//Initialisation du point de départ, son poids sera égal à 0
	for(var e=0; e<tabPoid.length; e++){
		if(tabPoid[e][0]== depart){
			tabPoid[e][1] = 0;
		}
	}


	//Fonction qui recherche le poids minimum non parcouru
	function mini(tab){
		var min = 10000;
		for(var f = 0; f < tab.length; f++){
			if(tab[f][1] <= min && tab[f][2] == 0){//Si pas parcouru
				min = tab[f][1];
				noeudMin = tab[f][0];
				indexMin = f;
			}
		}
		tabPoid[indexMin][2]=1;
		return [indexMin,noeudMin];
	}


	var ini = mini(tabPoid);

	//Algorithme de Dijkstra
	while( ini[1] != arrive){// Tant que l'arrêt avec le poids le plus faible n'est pas égal à l'arrêt d'arrivé
				k=0;
				while(k < arrets.length){
					if(arrets[k].d == tabPoid[ini[0]][0] || arrets[k].a == tabPoid[ini[0]][0]){//Si l'arrêt au moins un fils
						for(var j=0; j<tabPoid.length; j++){//Alors on parcours son ou ses fils
							if((arrets[k].a == tabPoid[j][0] || arrets[k].d == tabPoid[j][0])  && tabPoid[j][2] == 0 && ((tabPoid[ini[0]][1]+arrets[k].l)<tabPoid[j][1] || tabPoid[j][1]==10000)){//Si le fils n'a pas déja été parcouru
								tabPoid[j][1] = tabPoid[ini[0]][1] + arrets[k].l; //On change le poids du fils
								tabPoid[j][3] = tabPoid[ini[0]][0];//On affecte l'antécédent au fils
							}
						}
					}
					k++;
				}
				ini = mini(tabPoid);//On cherche le nouveau min
	}

	//Affichage du trajet le plus court
	function afficheTrajet(poids,depart,arrive){
		var noeud = arrive;
		var dist = 0;
		var trajet = new Array();
		while(noeud != depart){
			for(var i=0;i<poids.length;i++){
				if(poids[i][0] == noeud){
					if(poids[i][0] == arrive){
						dist = poids[i][1]
					}
					trajet.push(poids[i][0]);
					if(poids[i][3]!=''){
						noeud = poids[i][3];
					}
				}
			}
		}
		trajet.push(depart);
		return [trajet.reverse().join("->"),dist];
	}

	document.getElementById('trajet').innerHTML = 'Trajet le plus court pour aller de ' + depart + ' à ' + arrive +' : <span id="res"> ' + afficheTrajet(tabPoid,depart,arrive)[0] + " pour une distance totale de : " +afficheTrajet(tabPoid,depart,arrive)[1] + " Km</span>";

	var p = '';
		p += '<table>';
   		p += '<caption>Tableau des poids</caption>';
   		p += '<tr>'
   		p += '<th>Nom du noeud</th>';
   		p += '<th>Poids</th>';
   		p += '<th>Déjà parcouru?</th>';
   		p += '<th>Antécédent</th>';
   		p += '</tr>';
   		for(var f = 0; f < tabPoid.length; f++){
   			p += '<tr>'
   			p += '<td>'+tabPoid[f][0]+'</td>';   
   			p += '<td>'+tabPoid[f][1]+'</td>';   
   			p += '<td>'+tabPoid[f][2]+'</td>';   
   			p += '<td>'+tabPoid[f][3]+'</td>';     		
     		p += '</tr>';
     	}
     	p += '</table>';
     	document.getElementById('poid').innerHTML = p;
}
