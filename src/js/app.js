//IMPORT
import * as $  from "jquery";
import data from '../json/details.json';
//import { register } from 'swiper/element/swiper-element-bundle'; //Error intern en el document
//register();


$(function(){
    /**********GENEREAL FUNCTIONS***********/
    //Modifica la variable de la categoria clicada
    function setCategory(el) {
        $(el).on("click", function(event){
            categoryClicked = event.target.id;
            localStorage.setItem("category", categoryClicked);
        });
    }

    //Modifica la variable del detall clicat
    function setDetail(el){
        $(el).on("click", function(){
            detailClicked  = $(this).attr('id');
            localStorage.setItem("detail", detailClicked);
        });
    }

    //Crea el mapa segons la latitud i l'altitud
    function createMap(el, lat, alt, img, title, zoom){
        const mapOptions = {
            center: [lat, alt],
            zoom: zoom
        }
    
        const map = new L.map(el, mapOptions);
        const layer = new L.TileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png');
        map.addLayer(layer);
        
        let markerOptions = {
            title: "Prefectrua de Nara",
            clickable: true,
            draggable: true
        }
        const marker = new L.Marker([lat, alt], markerOptions);
        if(img === ""){
            marker.bindPopup('<p style="text-align: center">'+title+'</p>').openPopup();
        }else{
            marker.bindPopup('<img style="width: 200px" src="'+img+'"><p style="text-align: center">'+title+'</p>').openPopup();
        }
        marker.addTo(map);
    }

    //Canvia el número de columnes de SwiperJS
    function gridSwiper(wWidth) {
        if (wWidth < 479){
            $('swiper-container').attr('slides-per-view', '1');
        // createSwiper(1);
        }else if(wWidth < 800){
            $('swiper-container').attr('slides-per-view', '2');
        // createSwiper(2);
        }else if (wWidth > 801){
            $('swiper-container').attr('slides-per-view', '4');
        // createSwiper(4);
        }
    }

    /*****HEADER*****/
    //Menu
    //Inserta el menú desplegable, el mostra. Quan es tanca, s'esborra
    const contentMenu = `<ul class="menuUl">
                            <li><a href="./about.html">Sobre Nara</a></li>
                            <li><a id="architecture" href="./category.html">Punts d'interès</a></li>
                            <li><a id="gastronomy" href="./detail.html">Gastronomia</a></li>
                            <li><a id="accommodations" href="./detail.html">Allotjaments turístics</a></li>
                        </ul>`;

    $(".iconMenu").on("click", function(){
        if($(".menu").find(".menuUl").length <= 0){
            $(".menu").append(contentMenu).hide();
            $(".menu").slideDown("slow");
        }else{
            $(".menu").slideUp("slow");
            setTimeout(() => {
                $(".menuUl").remove();
            }, 2000);   
        } 

        //Modifica la variable clickedCategory
        setCategory(".menu a");
    });

    //Si es prem fora del menú, es tanca
    $(document).on('click',function(e){
        if(!(($(e.target).closest(".menuUl").length > 0 ) || ($(e.target).closest(".iconMenu").length > 0))){
            $(".menu").slideUp("slow");
            setTimeout(() => {
                $(".menuUl").remove();
            }, 2000);   
    }
    });

    //Slider de les imatges de la capçalera
    let slideIndex = 1;

    function slideHeader(n) {
    let i;
    let x = document.getElementsByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length} ;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex-1].style.display = "block";
    }

    let n = 1;
    slideHeader(1);
    setInterval(() => {
        slideHeader(slideIndex += 1);
        n++;
        n > 4 ? n = 1 : n;
    }, 5000);



    /*****INDEX*****/
    //Afegeix el mapa a la pàgina principal i el swiper dels punts d'interès
    if($(".containerIndex")[0]){
        createMap('mapIndex', 34.413836863583136, 135.86368042265963, "https://upload.wikimedia.org/wikipedia/commons/2/2f/T%C5%8Ddai-ji_Kon-d%C5%8D.jpg", "Prefectura de Nara", 10);
        
        const arrArch = data["architecture"].information;
        arrArch.forEach( obj => {
            $(".containerIndex .swiperIndex").append(`<swiper-slide>
                                                            <div>
                                                                <a id="arch${obj.id}" href="./detail.html" class="card">
                                                                <img src="${obj.img[0].url}" alt="${obj.img[0].alt}">
                                                                <h5>${obj.name}</h5>
                                                                </a>
                                                            </div>
                                                        </swiper-slide>`);
        });
    }





    /*****CATEGORY*****/
    //Crea el contingut de la pàgina
    if ($(".containerCategory")[0]) {
        //Afegeix el breadcrumb
        const breadcrumb = `<div class="breadcrumbs"><p><a href="index.html">Inici</a><span class="separator">></span><span class="currentPage">Punts d'interès</span></p></div>`;
        $(".container").prepend(breadcrumb);

        const arrArch = data["architecture"].information;
        arrArch.forEach( a => {
            $(".containerCategory ul").append(`<li class="card">
                                                <a href="./detail.html" id="arch${a.id}">
                                                    <img src="${a.img[0].url}" alt="${a.img[0].url}">
                                                    <h5>${a.name}</h5>
                                                </a>
                                                </li>`);
        });
    }

    /*****DETAIL*****/
    //Rep l'id del enllaç selecionat i l'emmagatzema en localStorage
    let categoryClicked = localStorage.getItem("category");
    categoryClicked === "" ? categoryClicked = "architecture" : categoryClicked = categoryClicked;
    let detailClicked = "";

    setDetail(".card a");
    setDetail(".navBigScreen a");

    detailClicked = localStorage.getItem("detail");

    //Verifica que sigui la pàgina Detail i crea el contingut de la pàgina
    if ($(".containerDetail")[0]) {
        const infoCategory = data[categoryClicked];
        let breadcrumbCategory = "";
        if(categoryClicked === "architecture"){
            breadcrumbCategory = "Punts d'interès";
        }else if(categoryClicked === "gastronomy"){
            breadcrumbCategory = "Punts d'interès"
        }else{
            breadcrumbCategory = "Allotjaments turístics"
        }
        //Afegeix el breadcrumb
        const breadcrumb = `<div class="breadcrumbs"><p><a href="index.html">Inici</a><span class="separator">></span><span class="currentPage">${breadcrumbCategory}</span></span></p></div>`;
        $(".container").prepend(breadcrumb);

        //Crea la pàgina d'Allotjaments
        if(categoryClicked === "accommodations"){
            const title = `<h2>${infoCategory.title}</h2>`;
            const introduction = `<p>${infoCategory.introduction}</p>`;
            const objHotels = infoCategory.information;
            $(".containerDetail article").addClass("accommodation");
            $(".containerDetail article").append(title);
            $(".containerDetail article").append(introduction);
            objHotels.forEach(hotel => {
                $(".containerDetail article").append(`<section>
                                                        <h3>${hotel.name}</h3>
                                                        <p>${hotel.description}</p>
                                                        <p class="price">El preu per nit és de ${hotel.price}€.</p>
                                                        <div id="map${hotel.id}" class="accommodationMap"></div>
                                                        <p>Per a més informació visiti la web oficial: <a href="${hotel.url}">${hotel.name}</a></p>
                                                    </section>`);
                
                createMap(`map${hotel.id}`, hotel.latitude, hotel.altitude, "", hotel.ubication, 15);
            });
        }

        //Crea la pàgina Gastronomia
        if(categoryClicked === "gastronomy"){
            const title = `<h2>${infoCategory.title}</h2>`;
            const objFoods = infoCategory.information;
            $(".containerDetail article").addClass("gastronomy");
            $(".containerDetail article").append(title);

            objFoods.forEach( food => {
                $(".containerDetail article").append(`<section>
                                                        <h3>${food.name}</h3>
                                                        <p>${food.description}</p>
                                                        <figure>
                                                            <img src="${food.img}" alt="${food.alt}">
                                                            <figcaption><a href="${food.attribution.url}">${food.attribution.author}</a></figcaption>
                                                        </figure>
                                                        
                                                    </section>`);
            });
                
        }

        //Crea la pàgina Punts d'interès
        if (categoryClicked === "architecture") {
            const arrArch = infoCategory.information;
            const idArch = Number.parseInt(detailClicked.substring(4));
            const objArch =  arrArch.filter(arch => arch.id === idArch);
            const objArch2 =  arrArch.filter(arch => arch.id !== idArch);
            const title = `<h2>${objArch[0].name}</h2>`;
            
            //Modifica el breadcrumb
            $(".breadcrumbs p .currentPage").replaceWith(`<a href="category.html">${breadcrumbCategory}</a>`);
            $(".breadcrumbs p").append(`<span class="separator">></span><span class="currentPage">${objArch[0].name}</span>`);
            
            $(".containerDetail article").addClass("architecture");
            $(".containerDetail article").append(title);

            //Contingut bàsic. 3 paràgrafs i 2 imatges.
            let content = `<p>${objArch[0].description[0]}</p>
                            <figure>
                                <img src="${objArch[0].img[0].url}" alt="${objArch[0].img[0].alt}">
                                <figcaption><a href="${objArch[0].img[0].attribution.url}">${objArch[0].img[0].attribution.author}</a></figcaption>
                            </figure>
                            <p>${objArch[0].description[1]}</p>
                            <p>${objArch[0].description[2]}</p>
                            <figure>
                                <img src="${objArch[0].img[1].url}" alt="${objArch[0].img[1].alt}">
                                <figcaption><a href="${objArch[0].img[1].attribution.url}">${objArch[0].img[1].attribution.author}</a></figcaption>
                            </figure>`;

            //Si te un quart pràgraf, s'afegeix
            if(objArch[0].description.length > 3){
                content += `<p>${objArch[0].description[3]}</p>`;
            }

            $(".containerDetail article").append(content);

            //Si té un llistat l'afegeix juntament amb una imatge
            if(objArch[0].list != undefined){
                $(".containerDetail article").append(`<section><h3>Què és pot fer?</h3></section>`);
                $(".containerDetail article section").append("<ul></ul>");
                objArch[0].list.description.forEach( li => {
                    
                    $(".containerDetail article ul").append(`<li>${li}</li>`);
                });
                $(".containerDetail article").append(`<figure>
                                                        <img src="${objArch[0].img[2].url}" alt="${objArch[0].img[2].url}">
                                                        <figcaption><a href="${objArch[0].img[2].attribution.url}">${objArch[0].img[2].attribution.author}</a></figcaption>
                                                    </figure>`);
            }
            
            //Afegeix el mapa
            $(".containerDetail article").append(`<section>
                                            <h3>Ubicació</h3>
                                            <div class="architectureMap" id="mapDetail${objArch[0].id}"></div>
                                        </section>`);

            createMap(`mapDetail${objArch[0].id}`, objArch[0].latitude, objArch[0].altitude, objArch[0].img[0].url, objArch[0].name, 15);
            
            //Crea un swiper amb la resta de punts d'interès
            $(".containerDetail").append(`<section>
                                            <h2>Altres Punts d'interès</h2>
                                            <swiper-container class="swiperDetail" space-between="25" grab-cursor="true" navigation="true" slides-per-view="1"></swiper-container>
                                        </section>`);
            objArch2.forEach( obj => {
                $(".containerDetail .swiperDetail").append(`<swiper-slide class="card">
                                                                <div>
                                                                    <a id="arch${obj.id}" href="./detail.html" class="card">
                                                                    <img src="${obj.img[0].url}" alt="${obj.img[0].alt}">
                                                                    <h5>${obj.name}</h5>
                                                                    </a>
                                                                </div>
                                                            </swiper-slide>`);
            });
        } 
    }

    //Modifica detailClicked segons l'element de Swiper clicat
    $("swiper-slide a").on("click", function(){
        detailClicked  = $(this).attr('id');
        localStorage.setItem("detail", detailClicked);
    });

    /*****NAV*****/
    //Modifica la variable clickedCategory
    setCategory(".indexHeader a");
    setCategory("footer a");



    //Modifica el nombre de slide que es mostren en pantalla segons la mida de la pantalla
    let wWidth = $(window).width();
    gridSwiper(wWidth);

    $(window).on("resize", function(){  
        let wWidth = $(window).width();
        gridSwiper(wWidth);
    });

});