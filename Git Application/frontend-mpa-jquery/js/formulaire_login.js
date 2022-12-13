//lorsque le DOM est prêt
$( document ).ready(function() {
    //console.log( "ready!" );

    $('#submitLogin').on('click', function submit() {

        let login = $('#login').val()
        let password = $('#password').val()

        fetch(API_URL + '/login', 
        { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'login': login, 
                'password': password
            })
        }).then(response => {
            if(response.status !== 200) {
                throw new Error(response.status)
            }
            return response.json();
        })
        .then(data => { 
            console.log(data);
            var payload = jwt_decode(data.token);
            console.log(payload); 
            $('#message').html('Authorisé');
            
            window.sessionStorage["connected"] = true;
            window.sessionStorage["token"] = data.token
            window.sessionStorage["payload"] = JSON.stringify(payload);

            $('#message').hide('slow', function() {
                window.location.href = "page_membre.html";
            });
        }).catch(function(error)
        {
          ///if status code 401...
          $('#message').html('Pas authorisé');
        });

    });
});