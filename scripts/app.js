var baseActividadesUrl = "http://192.168.2.4/actividadesapi/api/";


$(document).ready(function() {

    $('.navbar').append('<button type="button" class="btn-back" ><i class="material-icons">exit_to_app</i></button>')
    $('.btn-back').click(() => {
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

        var listPromise = getWithAuthorization(`${baseActividadesUrl}deportistas/${actividad}?year=${ano}`);

        var statsPromise = getWithAuthorization(`${baseActividadesUrl}deportistas/cadetes/stats/debitos`);

        Promise.all([listPromise,statsPromise])
        .then(function(data){
            console.log(data);
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
                  records: data[0]
                }
            }).data('dynatable');

            dynatable.settings.dataset.originalRecords = data[0];
            dynatable.process();
    
            showList();
            $('.loader').fadeOut(300);
            $(".table-container").fadeIn(300);

            loadAndRenderStats(data[1]);

        }).catch((err)=> { alert(err.statusText)});

        

    }).click();


    $('#btn-list').click( showList );
    $('#btn-stats').click( showStats );

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

function showList() {
    $('#btn-list').addClass('selected');
    $('#btn-stats').removeClass('selected');

    $('#tab-list').fadeIn(100);
    $('#tab-stats').fadeOut(100);

}

function showStats() {
    $('#btn-stats').addClass('selected');
    $('#btn-list').removeClass('selected');

    $('#tab-stats').fadeIn(100);
    $('#tab-list').fadeOut(100);

}

function loadAndRenderStats(stats) {

    $('#column-1').empty();

    let card = $('<div class="stats-card"></div>');
    card.append("<div class='stats-row header'><i class='material-icons'>monetization_on</i><p>Cobros Débitos</p></div>");
    card.append(stats.map(val => `<div class='stats-row'><p>${moment().month(val.month-1).format("MMMM")}</p><p>${val.descripcion}</p><p>${val.importe} $</p></div>`));

    $('#column-1').append(card);
}


function getWithAuthorization(url) {
    return $.ajax({
        type: "GET",
        beforeSend: function(request) {
          request.setRequestHeader("Authorization", `Bearer ${window.sessionStorage.accessToken}`);
        },
        url: url,
    })
}

