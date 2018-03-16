$(document).ready(function() {
    $('.loader').fadeIn(200);
    let id = $('#id-deportista').html();

    $('.navbar').append('<input type="button" class="btn-back" value="X" onclick="window.history.back()" />');

    $.ajax({
        type: "GET",
        beforeSend: function(request) {
          request.setRequestHeader("Authorization", `Bearer ${window.sessionStorage.accessToken}`);
        },
        url: `http://192.168.2.4/actividadesapi/api/deportistas/${id}`,
      })
    .then(function(data){
        $('#apenom').html(`<p>${data.orden}</p><p class='apenom-header'>${data.apellido} ${data.nombre}   </p><p>${data.habilitado}</p>`);   
        
        let card1 = $("<div class='deportistas-data-card'></div>");
        let card2 = $("<div class='deportistas-data-card'></div>");
        let card3 = $("<div class='deportistas-data-card'></div>");


        let fechaVencimiento = new Date(data.fecha_venc);

        card1.append(`<div class='deportistas-data-row header'><i class="material-icons">account_circle</i><p>Datos Socio</p></div>`)
        card1.append(`<div class='deportistas-data-row'><span>Documento:  </span><p>${data.documento}</p></div>`);
        card1.append(`<div class='deportistas-data-row'><span>Num. Socio:  </span><p>${data.numSocio}</p></div>`);
        card1.append(`<div class='deportistas-data-row'><span>Descuento:  </span><p>${data.descuento}</p></div>`);
        card1.append(`<div class='deportistas-data-row'><span>Fecha Nac.:  </span><p>${data.fecha_nacimiento.slice(0,10)}</p></div>`);
        card1.append(`<div class='deportistas-data-row'><span>Turno 1:  </span><p>${data.turno1}</p><span class='span2'>Turno 2:  </span><p>${data.turno2 == 9? "-" : data.turno2}</p></div>`);
        card1.append(`<div class='deportistas-data-row'><span>Telefono:  </span><p>${data.telefono}</p></div>`);
        card1.append(`<div class='deportistas-data-row'><span>Email:  </span><p>${data.email}</p></div>`);
        card1.append(`<div class='deportistas-data-row'><span>Observaciones:  </span><p>${data.observaciones}</p></div>`);


        card2.append(`<div class='deportistas-data-row header'><i class="material-icons">credit_card</i><p>Datos Tarjeta</p></div>`);
        card2.append(`<div class='deportistas-data-row'><span>Tarjeta:  </span><p>${data.tarjeta}</p></div>`);
        card2.append(`<div class='deportistas-data-row'><span>Numero:  </span><p>${data.numTarjeta}</p></div>`);
        card2.append(`<div class='deportistas-data-row'><span>Fecha Venc.:  </span><p>${fechaVencimiento.getMonth() +1}/${fechaVencimiento.getFullYear()}</p></div>`);
        card2.append(`<div class='deportistas-data-row'><span>Importe:  </span><p>${data.importe} $</p></div>`);

        card3.append(`<div class='deportistas-data-row header'><i class="material-icons">settings</i><p>Datos Usuario</p></div>`);
        card3.append(`<div class='deportistas-data-row'><span>Fecha Alta:  </span><p>${moment(data.aud_fecha).format("d/MM/YYYY - hh:mm:ss")}</p></div>`);
        card3.append(`<div class='deportistas-data-row'><span>Usuario:  </span><p>${data.aud_id_usuario}</p></div>`);
        
        $("#col1").append(card1);
        $("#col2").append(card2,card3);

        $('.loader').fadeOut(200);
        $(".deportistas-data").fadeIn(300);
    })
    .catch((err) => console.log(err));

    $.ajax({
        type: "GET",
        headers: {
            "Authorization": `Bearer ${window.sessionStorage.accessToken}`
        },        
        url: `http://192.168.2.4/actividadesapi/api/deportistas/pagos/${id}`,
      })
        .then( pagos => renderPagos(pagos))
        .catch( error => console.log(error));


});

function renderPagos(pagos){
    
    let card = $("<div class='deportistas-data-card'></div>");
    card.append(`<div class='deportistas-data-row header'><i class="material-icons">receipt</i><p>Pagos</p></div>`);
    card.append(`<div class='deportistas-data-row header'><p>Fecha Pago</p><p>Fecha Cuota</p><p>Importe</p><p>Estado</p><p>Comprobante</p></div>`);
    
    pagos.forEach( val => {

        var pagoClass, estado; 
        switch (val.estado) {
            case 1:
                pagoClass = "pendiente";
                estado = "Pendiente";
                break;
            case 2:
                pagoClass = "aceptado";
                estado = "Aceptado";
                break;
            case 3:
                pagoClass = "rechazado";
                estado = "Rechazado";
                break;
            case 4:
                pagoClass = "cancelado";
                estado = "Cancelado";
                break;
        }

        card.append(`<div class='deportistas-data-row pago ${pagoClass}'><p>${moment(val.fechaPago).format("d/MM/YYYY - hh:mm:ss")}</p><p>${moment(val.fechaCuota).format("MMMM YYYY")}</p><p>${val.importe} $</p><p>${estado}</p><p>${val.comprobante}</p></div>`);
    });

    $("body").append(card);
};




