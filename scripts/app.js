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

