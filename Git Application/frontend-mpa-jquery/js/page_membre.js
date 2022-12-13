//lorsque le DOM est prêt
$(document).ready(function () {
    //console.log( "ready!" );

    //Si le user n'est pas connecté alors on redirige vers login.html 
    if (!window.sessionStorage["connected"]) {
        window.location.href = "formulaire_login.html";
        return;
    }

    let payload = window.sessionStorage["payload"];
    payload = JSON.parse(payload);
    $('#display_login').html(payload.nom);

    $('#logout').on('click', function logout() {

        let token = window.sessionStorage["token"]
        window.sessionStorage.clear();

        //Blacklister le token JWT
        fetch(API_URL + '/logout', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.status)
            }
            window.location.href = "/";

            //return response.json();
        }).catch(function (error) {
            ///if status code 401...
            window.location.href = "/";

        });

    });

    fetch(API_URL + '/produits', {
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
        .then(listProduits => {
            console.log(listProduits);
            for (let i = 0; i < listProduits.length; i++) {
                let produit = listProduits[i];
                let ligne_produit_html = `<tr align="center">
                <td>` + produit.nom + `</td>
                <td><img width="50px" height="50px" src="` + STATIC_URL + `/uploads/produits/` + produit.image + `" /></td>
                <td>` + produit.qty + `</td>
                <td>` + produit.prix + `</td>
                <td>` + produit.qty * produit.prix + `</td>
                <td><a href="/formulaire_modifier_produit.html?id=` + produit.id + `">Modifier</a></td>                
                <td><button class="supprimerProduit" data="` + produit.id + `">Supprimer</button></td>            
                </tr>`;
                $('#tableProduits').append(ligne_produit_html);
            }

            $('.supprimerProduit').on('click', function (event) {

                //récupérer l'id qui est dans l'attribut data du bouton #supprimerProduit
                let id_produit = $(this).attr('data');

                fetch(API_URL + '/produits/' + id_produit, {
                        method: 'DELETE',
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
                    .then(data => {
                        console.log(data);
                        $('#message').html(data.message);
                        $('#message').hide(2000, function () {
                            window.location.href = "/";
                        });
                    }).catch(function (error) {
                        ///if status code 401...
                        //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
                        window.sessionStorage.clear();

                        $('#message').html('Pas authorisé, vous allez être redirigé...');
                        $('#message').hide('slow', function () {
                            window.location.href = "/";
                        });
                    });

            });

        }).catch(function (error) {
            ///if status code 401...
            //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
            window.sessionStorage.clear();

            $('#message').html('Pas authorisé, vous allez être redirigé...');
            $('#message').hide('slow', function () {
                window.location.href = "/";
            });
        });





});