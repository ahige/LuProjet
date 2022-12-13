//lorsque le DOM est prêt
$( document ).ready(function() {
    //console.log( "ready!" );

    //Si le user n'est pas connecté alors on redirige vers login.html 
    if(!window.sessionStorage["connected"]) {
        window.location.href = "formulaire_login.html";
        return;
    }

    window.location.href = 'page_membre.html'

});