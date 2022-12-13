//lorsque le DOM est prêt
$( document ).ready(function() {
    //console.log( "ready!" );

    //Si le user n'est pas connecté alors on redirige vers login.html 
    if(!window.sessionStorage["connected"]) {
        window.location.href = "formulaire_login.html";
        return;
    }

    //modifier_page.html?id=5&name=toto
    //parameters = {"id": "5", "name": "toto"}
    let parameters = new URLSearchParams(window.location.search)

    let id_produit = parameters.get('id');
    console.log(id_produit);

    fetch(API_URL + '/produits/' + id_produit, {
        method: 'GET',
        headers: {
            'Authorization': window.sessionStorage["token"],
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(response.status)
        }
        return response.json();
    })
    .then(produit => {
        console.log(produit);
       
        $('#display_nom_produit').html(produit.nom + `
                    <img width="50" height="50" src="` 
                    + STATIC_URL + `/uploads/produits/` + produit.image + `" />`)
        $('#nom_produit').val(produit.nom);
        $('#qty_produit').val(produit.qty);
        $('#prix_produit').val(produit.prix);

    }).catch(function (error) {
        ///if status code 401...
        //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
        window.sessionStorage.clear();

        $('#message').html('Pas authorisé, vous allez être redirigé...');
        $('#message').hide('slow', function () {
            window.location.href = "/";
        });
    });

    $('#submitModifierProduit').on('click', function submitAjoutProduit() {
        
        let nom_produit = $('#nom_produit').val()
        let image_produit = $('#image_produit')[0].files[0]; //Info + Contenu du fichier
        let qty_produit = $('#qty_produit').val()
        let prix_produit = $('#prix_produit').val()

        let data = new FormData();
        data.append('id_produit', id_produit); 
        data.append('nom_produit', nom_produit); 
        data.append('image_produit', image_produit);
        data.append('qty_produit', qty_produit);
        data.append('prix_produit', prix_produit);

        console.log(image_produit);

        fetch(API_URL + '/produits/' + id_produit, 
        { 
            method: 'PUT', 
            headers: {
                'Authorization': window.sessionStorage["token"]
            },
            body: data
        }).then(response => {
            if(response.status !== 200) {
                throw new Error(response)
            }
            return response.json();
        })
        .then(data => { 
            console.log(data);
            $('#message').html(data.message);
            $('#message').hide(2000, function() {
                window.location.href = "/";
            });    
        }).catch(function(response)
        {
          ///if status code 401...
          //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
          if(response.status == 401) {
            window.sessionStorage.clear();

            $('#message').html('Pas authorisé, vous allez être redirigé...');
            $('#message').hide('slow', function() {
                window.location.href = "/";
            });
           } else {
            $('#message').html('Problème de création du produit');          
           }
        });

    });



});