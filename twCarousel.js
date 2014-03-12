/*
* simple javascript carousel 0.0.1
* Twenga Company
*
* Params :
* ========================
* noeud > Le noeud DOM contenant tous les elements 
* thumbnail > Les noeuds DOM de chaque thumbnail > ex >
* thumbHover > Valeur booléenne qui prend en compte ou pas le survol des thumbnails
* timer > le temps en millisecondes entre deux début de rotations respectives.
* endRotation > temps en millisecondes au bout duquel la rotation automatique peut stopper. Si omit, pas de fin.
* compteur > chaine de l'attribut ID ou doit s'afficher la slide active
* btNext > chaine de l'attribut ID ou s'attache l'action "slide suivante"
* btPrev > chaine de l'attribut ID ou s'attache l'action "slide précédente"
* AnimFrequency > temps en millisecondes qui est l'intervalle entre laquelle l'animation de transition va se jouer
* AnimSplitdistance > valeur numérique indiquant la distance parcourue a chaque intervalle de temps
* interactStopAll > Valeur booléenne pour indiquer si oui ou non on stop le carousel lors d'une action sur les fleches.
* ========================
*
*/

(function(){

    var twCarousel = {};

    twCarousel.carouselize = function(params){

        /**
        * Values uses in everywhere are setted here
        */
        var cpt = 1;
        var nbrElts = 0;
        var thumbHover = 0;
        var nbrThbnls = 0;
        var wLucarne = 0;
        var widthElt = 0;
        var SmallestUnitMove;
        var thumbnail = false;
        var interval = false;
        var isAnimationRunning = false;
        var pagination = false;
        var btNext = false;
        var btPrev = false;
        var listElt = false;
        var endOfWorld = false;
        var interactStopAll = false;
        var direction = "left";
        var eachTime = 2000;
        var anF = 30;
        var anD = 1;
        var originalanD = 1;
        var hoverCallback = [];//for deactivate the hover if need
        var fnName1 = function(){_slideNext("action");};
        var fnName2 = function(){_slidePrev("action");};

        listElt = params.noeud;
        thumbnail = params.thumbnail;
        thumbHover = params.thumbHover;
        if(params.timer){eachTime = params.timer;}
        pagination = params.compteur;
        btNext = params.btNext;
        btPrev = params.btPrev;
        if(params.AnimFrequency){anF = params.AnimFrequency;}
        if(params.AnimSplitdistance){originalanD = anD = params.AnimSplitdistance;}
        endOfWorld = params.endRotation;
        interactStopAll = params.interactStopAll;

        nbrElts = listElt.length;

        if(nbrElts>1){

            //var wContainer = 0;
            var Lucarne = listElt[0].parentNode;
            wLucarne = Lucarne.offsetWidth;
            widthElt = listElt[0].offsetWidth;
            twCarousel.addClass(listElt[0],"active");

            /* Calculate wrapper */
            //wContainer = nbrElts*widthElt;

            twCarousel.setCssAttribute(Lucarne,"position:relative;");
            for(var k=0; k<nbrElts; k++){
                twCarousel.setCssAttribute(listElt[k],"position:absolute;left:"+widthElt*k+"px;");
            }

            if(endOfWorld){
                setTimeout(function(){
                    clearInterval(interval);
                }, endOfWorld);
            }

            _initCarousel(eachTime);

            var next = document.getElementById(btNext);
            var prev = document.getElementById(btPrev);
            _btClick(next,prev);

        }

            /* = functions ================================================================= */
            function _animation(targetNode,from,to){
                /* show the current frame */
                anD += 1;
                var currentP = 0;
                if(direction==="left"){
                    if(from>to){
                        currentP = from-anD;
                        if(currentP<to){
                            currentP = to;
                        }
                        targetNode.style.left = currentP+"px";
                        _anime(targetNode,currentP,to);
                    }else{
                        currentP = from+anD;
                        isAnimationRunning = false;
                        anD = originalanD;
                        _btClick(next,prev);
                    }
                }else{
                    if(from<to){
                        currentP = from+anD;
                        if(currentP>to){
                            currentP = to;
                        }
                        targetNode.style.left = currentP+"px";
                        _anime(targetNode,currentP,to);
                    }else{
                        currentP = from-anD;
                        isAnimationRunning = false;
                        anD = originalanD;
                        _btClick(next,prev);
                    }
                }
            }

            /* = functions ================================================================= */
            function _anteTreatment(){
                if(interactStopAll){//Si la désactivation du carousel a été désactivé lors du clic
                    clearInterval(interval);
                    endOfWorld = 1;
                }
            }

            /* = functions ================================================================= */
            function _anime(targetNode,from,to){
                isAnimationRunning = true;
                SmallestUnitMove = setTimeout(function(){
                    _animation(targetNode,from,to);
                }, anF);
            }

            /* Manage class "active" */
            function _prepareMove(targetNode,movefrom,moveto){
                if(moveto === 0){
                    twCarousel.addClass(targetNode,"active");
                }else{
                    twCarousel.removeClass(targetNode,"active");
                }
                _anime(targetNode,movefrom,moveto);
            }

            /* = Gestion pagination ================================================================= */
            function _paginate(cpt){
                if(pagination){
                    document.getElementById(pagination).innerHTML = cpt;
                }
            }

            /* Function eventClickSlieDirectTo */
            function _gototheslide(o){
                return function(){
                    _slideDirectTo("action",o+1);
                };
            }

            /* Function eventClickSlieDirectTo */
            function _gotothepic(r){
                return function(){
                    _displayDirect("action",r+1);
                };
            }

            /* = init thumbnails ================================================================= */
            function _initThumbnail(){
                if(thumbnail){
                    nbrThbnls = thumbnail.length;
                    for(var n=0; n<nbrThbnls; n++){
                        thumbnail[n].numerous = n+1;
                        if(cpt === n+1){
                            twCarousel.addClass(thumbnail[n],"activeSlide");
                        }else{
                            twCarousel.removeClass(thumbnail[n],"activeSlide");
                        }
                        var fnName3 = _gototheslide(n);
                        twCarousel.attachAnEvent("click",thumbnail[n],fnName3);
                    }
                    
                    if(thumbHover===1){
                        for(var q=0; q<nbrThbnls; q++){
                            hoverCallback[q] = _gotothepic(q);
                            twCarousel.attachAnEvent("mouseover",thumbnail[q],hoverCallback[q]);
                            //$.detachAnEvent("mouseover",thumbnail[q],hoverCallback[q]);
                        }
                    }
                }
            }

            /* = init carousel ================================================================= */
            function _initCarousel(eachTime){
                _initThumbnail();
                interval = window.setInterval(function(){
                    if(!isAnimationRunning){
                        _slideNext();
                        _initThumbnail();
                    }
                }, eachTime);
            }

            /* = bind clicks ================================================================= */
            function _btClick(NbtNext,NbtPrev){
                if(NbtNext){
                    twCarousel.attachAnEvent("click",NbtNext,fnName1);
                }
                if(NbtPrev){
                    twCarousel.attachAnEvent("click",NbtPrev,fnName2);
                }
            }

            /* = unbind all clicks ================================================================= */
            function _btUnClick(NbtNext,NbtPrev){
                if(NbtNext){
                    twCarousel.detachAnEvent("click",NbtNext,fnName1);
                }
                if(NbtPrev){
                    twCarousel.detachAnEvent("click",NbtPrev,fnName2);
                }
            }

            /* event mouseover suppress on thumbnails */
            function _thumbUnhover(){
                if(thumbHover===1){
                    nbrThbnls = thumbnail.length;
                    for(var u=0;u<nbrThbnls;u++){
                        twCarousel.detachAnEvent("mouseover",thumbnail[u],hoverCallback[u]);
                    }
                }
            }


            function _slideNext(action){
                direction = "left";
                _btUnClick(next,prev);
                _thumbUnhover();
                if(action === "action"){_anteTreatment();}
                if(!isAnimationRunning){
                    if(nbrElts !== 0){
                        var moveto = 0;
                        var movefrom = 0; 
                        if(cpt === nbrElts){
                            listElt[0].style.left = (widthElt*nbrElts)+widthElt;
                            for(var l=0; l<nbrElts; l++){
                                if(l === nbrElts-1){//at the end, last element is init on first position
                                    moveto = 0-widthElt;
                                    movefrom = 0;
                                }else{
                                    cpt = 0;
                                    moveto = (widthElt*l)-(widthElt*cpt);
                                    movefrom = (widthElt*l)-(widthElt*(cpt-1));
                                }
                                _prepareMove(listElt[l],movefrom,moveto);
                            }
                            _paginate(1);
                            cpt++;
                        }else{
                            for(var p=0; p<nbrElts; p++){
                                if(cpt>0){
                                    movefrom = (widthElt*p)-(widthElt*(cpt-1));
                                    moveto = (widthElt*p)-(widthElt*cpt);
                                }else{//si on est à la première slide
                                    movefrom = (widthElt*p)-(widthElt*cpt);
                                    moveto = (widthElt*p)-widthElt;
                                }
                                _prepareMove(listElt[p],movefrom,moveto);
                            }
                            cpt++;
                            _paginate(cpt);
                        }

                    }
                }
            }

            function _slidePrev(action){
                direction = "right";
                _btUnClick(next,prev);
                _thumbUnhover();
                if(action === "action"){_anteTreatment();}
                if(!isAnimationRunning){
                    clearInterval(interval);
                    var movefrom = 0;
                    var moveto = 0;
                    var m = 0;
                    if(nbrElts !== 0){
                        if(cpt === 1){
                            listElt[nbrElts-1].style.left = -widthElt;
                            for(var l=0; l<nbrElts; l++){
                                if(l === nbrElts-1){
                                    movefrom = -widthElt;
                                    moveto = 0;
                                }else{
                                    m = l+1;
                                    movefrom = (widthElt*m)-(widthElt*cpt);
                                    moveto = ((widthElt*m)-(widthElt)*cpt)+widthElt;
                                }
                                _prepareMove(listElt[l],movefrom,moveto);
                            }
                            cpt = nbrElts;
                            _paginate(nbrElts);
                        }else{
                            for(var r=0; r<nbrElts; r++){
                                m = r+1;
                                movefrom = (widthElt*m)-(widthElt*cpt);
                                moveto = ((widthElt*m)-(widthElt)*cpt)+widthElt;
                                _prepareMove(listElt[r],movefrom,moveto);
                            }
                            cpt--;
                            _paginate(cpt);
                        }

                    }
                    if(!endOfWorld){
                        _initCarousel(eachTime);
                    }
                }
            }

            /**
            * Slide smoothly to the slide corresponding to the thumbnail when click is detected
            */
            function _slideDirectTo(action,to){
                _btUnClick(next,prev);
                _thumbUnhover();
                if(action === "action"){_anteTreatment();}
                if(!isAnimationRunning){
                    direction = "left";
                    clearInterval(interval);
                    if(nbrElts !== 0){
                        var movefrom = 0;
                        var moveto = 0;
                        var pp = 0;
                        for(var p=0; p<nbrElts; p++){
                            pp = p+1;
                            if(p===cpt-1  && cpt!==to){
                                movefrom = 0;
                                moveto = -widthElt;
                                _prepareMove(listElt[p],movefrom,moveto);
                            }else if(pp===to && cpt!==to){
                                movefrom = widthElt;
                                moveto = 0;
                                _prepareMove(listElt[p],movefrom,moveto);
                            }
                        }
                        cpt = to;
                        //_initCarousel(eachTime);
                        _paginate(cpt);
                    }
                    if(!endOfWorld){//Si il n'y a pas de compte a rebours initialisé, on relance le carousel
                        _initCarousel(eachTime);
                    }
                }
            }

            function _displayDirect(action,to){
                _btUnClick(next,prev);
                _thumbUnhover();
                if(action === "action"){_anteTreatment();}//On désactive le clique sur les boutons si il y en a.
                if(!isAnimationRunning){
                    direction = "left";
                    clearInterval(interval);
                    var moveto = 0;
                    var pp = 0;
                    if(nbrElts !== 0){
                        for(var p=0; p<nbrElts; p++){
                            pp = p+1;
                            if(p===cpt-1  && cpt!==to){//On déplace l'élément courant (modulo l'utilisateur n'as pas cliqué dessus)
                                moveto = -widthElt;
                                listElt[p].style.left = moveto+"px";
                            }else if(pp===to && cpt!==to){//On déplace vers l'élément désigné
                                moveto = 0;
                                listElt[p].style.left = moveto+"px";
                            }
                        }
                        cpt = to;
                        _paginate(cpt);
                    }
                    if(!endOfWorld){//Si il n'y a pas de compte a rebours initialisé, on relance le carousel
                        _initCarousel(eachTime);
                    }
                }
            }

    /* Fin de la méthode carousselize */
    };


/* = Public functions ================================================================= */
    twCarousel.getElementsByClassName = function(wrapNode, classname){
        if(document.querySelector===undefined){
            var a = [];
            var re = new RegExp('(^| )'+classname+'( |$)');
            var els = wrapNode.getElementsByTagName("*");
            for(var i=0,j=els.length; i<j; i++){
                if(re.test(els[i].className)){
                    a.push(els[i]);
                }
            }
            return a;
        }else{
            return wrapNode.querySelectorAll("." + classname);
        }
    };

    twCarousel.setCSS = function(domNode,keyValue){
        var existant = domNode.getAttribute("style");
        var itsanew = 0;
        var newString = "";
        var oldKey = "";
        var newKey = "";
        var newValue = [];
        var toSave = [];
        var oldValue = [];
        newValue = keyValue.split(";");
        if(document.all){//Ie
            if(existant!=null){//Ie10
                if(existant[0]!=null){//Ie>10
                    oldValue = existant.split(";",0);
                    for(var s=0;s<oldValue.length-1;s++){
                        for(var k=0;k<newValue.length-1;k++){
                            newKey = newValue[k].split(":");
                            oldKey = oldValue[s].split(":");
                            if(newKey[0] === oldKey[0]){
                                itsanew = 1;
                                toSave[s] = oldKey[0]+":"+newKey[1]+";";
                            }
                        }
                        if(itsanew === 1){
                            newString += toSave[s];
                        }else{
                            newString = newString+oldValue[s]+";";
                        }
                        itsanew = 0;
                    }
                    domNode.style.setAttribute("cssText",newString);
                }else{
                    domNode.style.setAttribute("cssText",keyValue);
                }
            }else{
                domNode.style.setAttribute("cssText",keyValue);
            }
        }else{
            if(existant !== null){
                oldValue = existant.split(";",0);
                for(var m=0;m<oldValue.length-1;m++){
                    for(var t=0;t<newValue.length-1;t++){
                        newKey = newValue[t].split(":");
                        oldKey = oldValue[m].split(":");
                        if(newKey[0] ===oldKey[0]){
                            itsanew = 1;
                            toSave[m] = oldKey[0]+":"+newKey[1]+";";
                        }
                    }
                    if(itsanew === 1){
                        newString += toSave[m];
                    }else{
                        newString = newString+oldValue[m]+";";
                    }
                    itsanew = 0;
                }
                domNode.setAttribute("style",newString);
            }else{
                domNode.setAttribute("style",keyValue);
            }
        }
    };

    twCarousel.setCssAttribute = function(domNode, keyValue){
        if(domNode.length === undefined){
            twCarousel.setCSS(domNode,keyValue);
        }else{
            for(var j=0; j<domNode.length; j++){
                twCarousel.setCSS(domNode[j],keyValue);
            }
        }
    };

    twCarousel.addClass = function(nodeToCheck, cl){
        nodeToCheck.className = nodeToCheck.className;
        var existing = nodeToCheck.className;
        var clls = existing.split(" ");
        var alreadyExist = 0;
        for(var a=0; a<clls.length; a++){
            if(clls[a]===cl){
                alreadyExist++;
            }
        }
        if(alreadyExist===0){
            nodeToCheck.className = nodeToCheck.className+" "+cl;
        }
    };

    twCarousel.removeClass = function(nodeToCheck, cl){
        var trimStr = "";
        trimStr = nodeToCheck.className;
        var clsss = trimStr.split(" ");
        var nwClass = "";
        for(var o=0; o<clsss.length; o++){
            if(clsss[o] !== cl){   
                nwClass = nwClass+" "+clsss[o];
            }
        }
        nwClass = nwClass.replace(/ +/g,' ');
        nwClass = nwClass.substring(1);
        nodeToCheck.className = nwClass;
    };

    twCarousel.attachAnEvent = function(evName,NId,fnName){
        var evNameIE = "";
        if(evName==="click"){evNameIE = "onclick";}else{evNameIE=evName;}
        if(NId.addEventListener){
          NId.addEventListener(evName, fnName, false);
        }else if(NId.attachEvent){
          NId.attachEvent(evNameIE, fnName);
        }
    };

    twCarousel.detachAnEvent = function(evName,NId,fnName){
        var evNameIE = "";
        if(evName==="click"){evNameIE = "onclick";}else{evNameIE=evName;}
        if(NId.removeEventListener){
          NId.removeEventListener(evName, fnName, false);
        }else if(NId.attachEvent){
          NId.detachEvent(evNameIE, fnName);
        }
    };

    window.twCarousel = twCarousel;

})();

