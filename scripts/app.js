// import $ from 'jquery';
// import printMe from './print.js';
$(document).ready(function() {
   
    $.get("http://192.168.2.4/actividadesapi/api/deportistas?year=2017")
    .then(function(data){
        $("#deportistas-table").bind('dynatable:afterUpdate', (x,y) => {
            let trs = $('tbody tr');
            for (let i=0; i < trs.length; i++){
                if (trs[i].children[12].innerHTML == "Deshabilitado"){
                    $(trs[i]).addClass("disabled");
                }
            }
        });

        $('#deportistas-table').dynatable({
            dataset: {
              records: data
            }
        });

        var trs = $('tbody tr').on('click', function() {
            window.location.href = '/deportista/'+ $(this)[0].children[0].innerHTML;
        });

        $('.loader').fadeOut(300);
        $(".table-container").fadeIn(300);
    });
   
});




