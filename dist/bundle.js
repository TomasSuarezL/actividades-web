/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// import $ from 'jquery';
// import printMe from './print.js';
$(document).ready(function() {

    $('.navbar').append('<button type="button" class="btn-back" ><i class="material-icons">exit_to_app</i></button>').click(() => {
        $(".table-container").fadeOut(200);
        $('.loader').fadeIn(200);
        $.get('/logout')
        .then((data) => window.location.href = '/login')
        .catch((err) => console.log(err));
    });

    $('#cargar').click(function() {

        $(".table-container").fadeOut(200);
        $('.loader').fadeIn(200);
        let actividad = $("#actividad").val();
        let ano = $("#ano").val();
        console.log(actividad, ano);

        $.ajax({
            type: "GET",
            beforeSend: function(request) {
              request.setRequestHeader("Authorization", `Bearer ${window.sessionStorage.accessToken}`);
            },
            url: `http://192.168.2.4/actividadesapi/api/deportistas/${actividad}?year=${ano}`,
          })
        .then(function(data){
            $("#deportistas-table").bind('dynatable:afterUpdate', (x,y) => {
                let trs = $('tbody tr');
                for (let i=0; i < trs.length; i++){
                    if (trs[i].children[12].innerHTML == "Deshabilitado"){
                        $(trs[i]).addClass("disabled");
                    }
                }

                trs.on('click', function() {
                    window.location.href = '/deportista/'+ $(this)[0].children[0].innerHTML;
                });
            });
    
            let dynatable = $('#deportistas-table').dynatable({
                dataset: {
                  records: data
                }
            }).data('dynatable');

            dynatable.settings.dataset.originalRecords = data;
            dynatable.process();
    
            $('.loader').fadeOut(300);
            $(".table-container").fadeIn(300);

            console.log(calcularTotales(data));

        }).catch((err)=> { alert(err.statusText)});
    
    }).click();

});


function calcularTotales(data){
    $(".totales").empty();

    let habilitados = data.filter(x => x.habilitado == "Habilitado")

    let total = habilitados.reduce(function(acc,val){
        return acc += val.importe * val.cantTurnos * (1-val.descuento_float);
    },0);

    

    $(".totales").append(`<div>Importe Total: ${total} $</div><div>Total: ${data.length}</div><div>Habilitados: ${habilitados.length}</div>`);
    return data.length;
}



/***/ })
/******/ ]);