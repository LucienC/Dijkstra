window.onload=function(){
	 var depart = prompt("Arret de départ :", 'A,B,C,D,E,...');
	 var arrive = prompt("Arret d'arrivé' :", 'F,G,H,I,J,...');
      if (depart!=null && arrive!=null) {
      	   _cn("img",{src:'./img/wiki.png', alt: "Schema du réseau"},{},_tn('body')[0]);
      	   _cn('div',{id:'matrice'},{},_tn('body')[0]);
      	   _cn('div',{id:'poid'},{},_tn('body')[0]);
      	   _cn('div',{id:'trajet'},{},_tn('body')[0]);
           init(depart,arrive);
       }
}


function init(dep,arr){
	//d=Départ a=Arrivé l=length Récupéré depuis la base de données dans le futur
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
     		}else{//Pas première ligne
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
	document.getElementById('matrice').innerHTML = tab; //Affichage table des arcs de poid
	xy.splice(0, 1);//Suppression de la valeur vide pour Dijkstra
	dijkstra(xy,arrets,dep,arr);
		
}

function dijkstra(listArret,graph,depart,arrive){
	var k=0;

	function createTabPoid(array){
		var tabPoid = [];
		for(var i=0; i<array.length; i++){
		    tabPoid.push([array[i],10000,0,""]);
		  }
		  return tabPoid;
	}

	var tabPoid = createTabPoid(listArret);

	//initialisation du point de départ
	//console.log("initialisation du point de départ");
	for(var e=0; e<tabPoid.length; e++){
		if(tabPoid[e][0]== depart){
			// console.log("Le point de départ est "+tabPoid[e][0]);
			tabPoid[e][1] = 0;
		}
	}

	function mini(tab){//Rechercher le poid minimum non parcouru
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

	var ini = new Array();
	ini = mini(tabPoid);


//Algorithme de Dijkstra
	while( ini[1] != arrive){// Tant que l'arrêt avec le poid le plus faible n'est pas l'arret d'arrive
				k=0;
			console.log("Noeud actuel => "+tabPoid[ini[0]][0]);
				while(k < arrets.length){
					if(arrets[k].d == tabPoid[ini[0]][0] || arrets[k].a == tabPoid[ini[0]][0]){//Si il a un fils
						for(var j=0; j<tabPoid.length; j++){//On parcours les fils
							if(arrets[k].a == tabPoid[j][0] && tabPoid[j][2] == 0 && ((tabPoid[ini[0]][1]+arrets[k].l)<tabPoid[j][1] || tabPoid[j][1]==10000)){//Si le fils n'a pas déja été parcouru
								console.log("Fils trouvé! =>" +tabPoid[j][0]);
								tabPoid[j][1] = tabPoid[ini[0]][1] + arrets[k].l;
								tabPoid[j][3] = arrets[k].d;
							}
						}
					}
					k++;
				}	

				ini = mini(tabPoid);//On cherche le nouveau min
				console.log("Nouveau noeud => "+tabPoid[ini[0]][0]);
	}


	//Affichage du trajet le plus court
	function afficheTrajet(poids,depart,arrive){
		var noeud = arrive;
		var trajet = [arrive];
		while(noeud != depart){
			for(var i=0;i<poids.length;i++){
				if(poids[i][0] == noeud){
					trajet.push(poids[i][3]);
					noeud = poids[i][3];
				}
			}
		}
		return trajet.reverse().join("->");
	}

	document.getElementById('trajet').innerHTML = 'Trajet le plus court pour aller de ' + depart + ' à ' + arrive +' : <span id="res"> ' + afficheTrajet(tabPoid,depart,arrive) + "</span>";



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
   			p += '<td>'+tabPoid[f][0]+'</td>';//Lignes   
   			p += '<td>'+tabPoid[f][1]+'</td>';//Lignes   
   			p += '<td>'+tabPoid[f][2]+'</td>';//Lignes   
   			p += '<td>'+tabPoid[f][3]+'</td>';//Lignes     		
     		p += '</tr>';
     	}
     	p += '</table>';
     	document.getElementById('poid').innerHTML = p;
}
