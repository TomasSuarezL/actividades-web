$(function(){
    
    $('#btn-login').click( () => {

        $('.login-container').fadeOut(1);
        $('.loader').fadeIn(1);

        let username = $('input[name=uname]');
        let pwd = $('input[name=psw]');

        $.post('/login',{username: username.val() , password: pwd.val()})
        .then((data) => {
            if ( data.token !== undefined) {
                window.sessionStorage.accessToken = data.token;
                window.location.href = data.lastUrl === undefined ? '/' : data.lastUrl;
            }
            else {
                alert(data.body);
                username.val("");
                pwd.val("");
                $('.login-container').fadeIn(300);
                $('.loader').fadeOut(300);
                
            }
        })
        .catch((err) => {
            alert(err);
            $('.login-container').fadeIn(300);
            $('.loader').fadeOut(300);
        });
    });

    $(document).keypress(function(e) {
        if(e.which == 13) {
            $('#btn-login').click();
        }
    });

});


