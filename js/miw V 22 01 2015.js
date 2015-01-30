/*****************************************************************************************************************/
/*                                                                                                               */
/*                                Bibliothèque  MIW   version miw V 15 01 2015.js                                */
/*                                Réalisée dans le cadre des cours Javascript                                    */
/*                                De la Licence Activités et Techniques de Communication                         */
/*                                Mention Multimédia Internet Webmaster   (MIW)                                  */
/*                                IUT d'Aix-en-Provence Département GEA GAP                                      */
/*                                Site internet de la licence :     www.gap.univ-mrs.fr/miw                      */
/*                                                                                                               */
/*****************************************************************************************************************/

(function(){  // ief  ou fie fonction immédiatement exécutée.

/******************************************************************************************************/
/***********************  Les expressions régulières    ***********************************************/
/******************************************************************************************************/ 
		Reg = {											// objet contenant des expressions régulières
			required :  /[^.*]/,
			alpha :     /^[a-z ._-]+$/i,
			alphanum :  /^[a-z0-9 ._-]+$/i,
			digitSign : /^[-+]?[0-9]+$/,
			digit:/^[0-9]+$/,
			nodigit : /^[^0-9]+$/,
			number : /^[-+]?\d*\.?\d+$/,
			email : /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
			phone : /^[\d\s().-]+$/,
			url : /^(http|https):\/\/[a-z0-9\-\.\/_]+\.[a-z]{2,3}$/i,
			tag : /<[^<>]+>/g ,                                        // pour rechercher toutes les occurences d'une balise HTML ou XML
            script : /(<script).+(<\/script>)/gi,                      // pour rechercher toutes les occurences de script
			isbn : /^(978|979)-\d-\d{5}-\d{3}-\d$/					   // code pour identifier un livre
            			
		};
/********************************************************************************************************/
/****************************************** Gestion des évènements *****************************************/
/********************************************************************************************************/
// L'objet Event regroupe les méthodes:
//   -  addEvent(noeud,evenement,fonction,capture)  permettant d'ajouter un écouteur d'évènement sur un noeud
//         @param1    noeud: noeud sur lequel est positionné l'écouteur
//         @param2   evenement : type d'évènement que l'on veut détecter exemple: click, change, load ( remarque il ne faut pas mettre "on" devant le nom de l'évènement
//         @param3   fonction : nom de la fonction exécutée si l'évènement se produit
//         @param4   capture :  Booléen: Si la valeur true est transmise, l'évènement sera géré dans le mode "capturing "(Modèle de Netscape). Si false est tranmis, cas le plus courant, l'évènement est géré avec le système bubbling (modèle de Microsoft). 
//
//   -  delEvent(noeud,evenement,fonction,capture) permettant de retirer un écouteur d'évènement sur un noeud
//         @param1   noeud: noeud pour lequel on veut supprimer un écouteur
//         @param2  evenement : type d'évènement 
//         @param3  fonction : nom de la fonction
//         @param4  capture   : Booléen indique le sens de la capture
//
//   - posX()  permettant de retourner la position X (abscisse) de la souris après l'évènement click
//         @return    position de la souris en pixels par rapport au  bord gauche de la fenêtre
//
//   - posY() permettant de retourner la position Y (ordonnée) de la souris après l'évènement click
//          @return    position de la souris en pixels par rapport au  bord supérieur de la fenêtre
/*********************************************************************************************************/

Events = {
	addEvent : function(noeud,evenement,fonction,capture){
	 		      noeud.addEventListener?
			      noeud.addEventListener(evenement,fonction,capture):
	      	      noeud.attachEvent?
			      noeud.attachEvent("on"+evenement,fonction):
			      noeud["on"+evenement] = fonction;				
				},
	delEvent : function(noeud,evenement,fonction,capture){
			      noeud.removeEventListener?
			      noeud.removeEventListener(evenement,fonction,capture):
	      	      noeud.detachEvent?
			      noeud.detachEvent("on"+evenement,fonction):
			      noeud["on"+evenement] = "";	
				},
	posX: 	function(e){
		        var posx = 0;
				if (!e) var e = window.event;
				if (e.pageX ) posx = e.pageX;
				else if (e.clientX )posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				return posx;
			},
	posY: function(e){
				var posy = 0;
				if (!e) var e = window.event;
				if (e.pageY) posy = e.pageY;
				else if (e.clientY) posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				return posy;
			}		
}
/******************************************************************************************************/
/***********************  Les propriétés de la fenêtre  ***********************************************/
/******************************************************************************************************/ 		
		Window = {				                                                                                       // objet contenant des méthodes pour gérer l'écran.
			width:	function(){
						if (window.innerWidth)  return window.innerWidth           	 	                               // tous les navigateurs sauf IE
						else if (document.documentElement.clientWidth)	return document.documentElement.clientWidth;   // IE Strict
						else if (document.body.clientWidth) return document.body.clientWidth;      		               // IE non strict
						else return -1;                          	                                                   // anciens navigateurs
					},
			height:	function(){
						if (window.innerHeight)   return window.innerHeight;        								   // tous les navigateurs sauf IE
						else if (document.documentElement.clientHeight)  return document.documentElement.clientHeight; // IE Strict
						else if (document.body.clientHeight) return document.body.clientHeight;       	               // IE non strict
						else return -1;	          					                                                   // anciens navigateurs
					}
		};
/******************************************************************************************************/
/***********************  Les Raccourcis   pour le DOM  ***********************************************/
/******************************************************************************************************/
/******************************************************************************************************/
/***********************  Les Raccourcis   pour le DOM  ***********************************************/
/******************************************************************************************************/

/* recherche de noeuds */
		/* la fonction  _ permet d'accéder rapidement à un élément grace aux sélecteurs CSS3.  Exmples sur http://www.w3schools.com/cssref/css_selectors.asp */
		
		_=function(v){
		             if (document.querySelectorAll(v).length==1) { return document.querySelector(v);}
			         else {miw.elements = document.querySelectorAll(v);
					         return miw; // miw  un tableau de noeuds correspondant au filtre v
						  }
			};


		_id = function(id)   {return document.getElementById(id);};

		_tn = function(n)    {return document.getElementsByTagName(n);};
		_n  = function(n)    {return document.getElementsByName(n);} ;  

/* gestion des noeuds */


		_cf = function ()    {return document.createDocumentFragment()}		

		
		_ct =  function(tx,nodeInsert)  { var t=document.createTextNode(tx);
										  if (nodeInsert) nodeInsert.appendChild(t);
										  return t
										};

		_ce = function(el,nodeInsert)   { var e= document.createElement(el);
										  if (nodeInsert) nodeInsert.appendChild(e);
										  return e
										};

		_cn = function(node,attribut,style,nodeInsert){                                        // pour créer un noeud avec des attributs et des styles ( attributs et style sont des objets )
				var n = _ce(node);
				n.attrib(attribut);
				n.css(style);
				if (nodeInsert) nodeInsert.appendChild(n);
				return n;
			}
			
		_dn = function(node){                                                                    // pour supprimer un noeud
				node.parentNode.removeChild(node);
			}
			
 
/******************************************************************************************************/
/*************   Raccourci pour parcourir et traiter les propriétés d'un objet  ***********************/
/******************************************************************************************************/		
		_each = function(o,f){
				for (var i in o){ if( i!= "extend" )f(i,o[i])}
			}

			
/***********************************************************************************************************/
/****************************************** Gestion de l'AJAX **********************************************/
/***********************************************************************************************************/

	ajax= {
		xhr: function(){  // création d'un requete HTTP en fonction du navigateur
		   var obj = null;
		   try { obj = new ActiveXObject("Microsoft.XMLHTTP");}
			 catch(Error) { try { obj = new ActiveXObject("MSXML2.XMLHTTP");}
			   catch(Error) { try { obj = new XMLHttpRequest();}
				  catch(Error) { alert(' Impossible de créer l\'objet XMLHttpRequest')}
							}
						  }
		   return  obj;
		},

		_:function(obj){
			var url = obj.url, data=obj.data, method=obj.method,beforeSend=obj.beforeSend,error=obj.error,complete=obj.complete,cache=obj.cache,username=obj.username,password=obj.password;
	
			if (data==null)   data="";
			
			if (method==null) method="get";
			
			if (cache==null) cache="no";			
			
            cache=(cache=="no")? "cache="+new Date().getTime():"";

			var req = new ajax.xhr();
			if (req!= null){
			    if (beforeSend) beforeSend(req);
				req.onreadystatechange= function(){
					if (this.readyState==this.DONE ){
						if ((this.status == 200 || this.status == 0 ) && complete) complete(this)
							   else  if ((this.status != 200 && this.status != 0)  && error) error(this);
					}
				}

				if (typeof(data)=="object")   {var dataTemp=[];_each(data,function(p,v){dataTemp.push(p+"="+encodeURIComponent(v))}); data = dataTemp.join("&");}		
	
				if (data == null ) data = cache 
				            else  if (cache!="") data = data +"&" + cache;
				
				if (method=="get" || method=="GET" ) {data=(data==null)?"":"?"+data;req.open(method,url+data,true,username,password); req.send(null);}
					else  if (method=="post" || method=="POST" ){req.open(method,url,true,username,password);req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");req.send(data);}
			}
		}
	};		
/******************************************************************************************************/
/***********************  Les classes : Création & héritage  ******************************************/
/******************************************************************************************************/					
			

		extend = function(d,s){				// fonction permettant d'étendre les propriétés d'un objet (d) avec celles d'un autre objet (s)
			 for (var i in s){d[i]=s[i]}; 
		};
		
	
		Class = {
				create :function (className,proto){
							eval(className+"= function(){this.init.apply(this,arguments)}");
							eval("extend("+className+".prototype,proto)");
				
				},
				extend: function (classMere,classFille,proto){
							eval(classFille+"= function(){this.init.apply(this,arguments)}");   
							eval("extend("+classFille+".prototype,"+classMere+".prototype)");
							eval("extend("+classFille+".prototype,proto)");					
				}
		};

/******************************************************************************************************/
/***********************  Extension de la clase Object  ***********************************************/
/******************************************************************************************************/				
		Object.prototype.extend=function(obj){  
									for( var i in obj){this[i] =obj[i]};
								};
								

	
/******************************************************************************************************/
/***********************  Extension de la clase String  ***********************************************/
/******************************************************************************************************/			
		String.prototype.extend({
			left : function(n){return this.substring(0,n)},
			right : function(n){return this.substring(this.length-n)},
			convertCss: function(){	
					var ch =this, reg1=/-[a-z]/gi, reg2=/-/g;
					if (ch.match(reg1)){
						for (var i = 0 ; i< ch.match(reg1).length; i++){
							 ch = ch.replace(ch.match(reg1)[i],ch.match(reg1)[i].toUpperCase())
						}
						ch = ch.replace(reg2,"")
					}
					return ch;
			},
			capitalize: function(){
					return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
			},
			trim1: function(){
			        return this.replace(/(^\s*|\s*$)/g,"")
			}
		});
/******************************************************************************************************/
/***********************  Extension de la clase Array   ***********************************************/
/******************************************************************************************************/		
		
		Array.prototype.extend({
			merge : function(t){ 
					for (var i =0; i< t.length;i++){
						 this.push(t[i]);
					}
					return this
			}			
		});
/******************************************************************************************************/
/***********************  Extension de la clase Number  ***********************************************/
/******************************************************************************************************/		
		Number.prototype.extend({
			p : function(n){ return Math.pow(this,n)}
		});		
/******************************************************************************************************/
/***********************  Extension de la clase Node    ***********************************************/
/******************************************************************************************************/		
		Node.prototype.extend({
		
			changeId : function(val){ 
			
					this.id=val;
					return this;
			},
			css : function(obj) {
			
			        var n=this;   // n représente le noeud courant
					_each(obj,function(a,b){n.style[a.convertCss()]=b});		
					return this;
					
			},
			on : 	function(ev,f){
						  this["on"+ev]=f;
						  return this;
					},

					
			attrib :function(obj){
			            var n=this;   // n représente le noeud courant
						_each(obj,function(a,b){n[a]=b});
						return this;
			},
			appendTo : function(objStr){                    //  permet d'ajouter un noeud element ou un noeud texte au noeud
					if (typeof(objStr)== "string") { this.innerHTML += objStr }
						else { this.appendChild(objStr)}
					return this;
			},
			empty : function(){ this.innerHTML="";return this}				

		});
		
/******************************************************************************************************/
/**************************************  L'objet miw    ***********************************************/
/******************************************************************************************************/

        var miw = {            // objet contenant une nodeList et des méthodes de traitement
		
		    elements:[],	   // tableau contenant la nodeList	
			each	:	function(f){ for (var i = 0; i< this.elements.length; i++){f(i);};}, // Parcours de la nodelist , exécution de la fonction Callback pour chaque noeud		
			changeId: 	function(vid){ this.each(function(ind){	miw.elements[ind].changeId(vid)});return this;},
			css		:   function(obj){ this.each(function(ind){ miw.elements[ind].css(obj)});return this;},
			attrib  :   function(obj){ this.each(function(ind){ miw.elements[ind].attrib(obj)});return this;},
			on      :   function(ev,f){ this.each(function(ind){ miw.elements[ind].on(ev,f)});return this;},
		
		};	
		
					

				
})();

 
