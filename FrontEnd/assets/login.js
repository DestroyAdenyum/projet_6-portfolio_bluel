// Ciblage du formulaire
const formLoginElement = document.querySelector('#login');

const login = async (data) => {
    const user = {
        email: data.get('email'),
        password: data.get('password')
    }

    // effectue une requête POST vers l'URL pour effectuer une connexion
    return await fetch('http://localhost:5678/api/users/login', {
        // POST : indiquer que c'est une requête de création de données
        method: 'POST',
        // HEADERS : en-tête spécifiant que les données sont au format JSON
        headers: {
            'Content-Type': 'application/json',
        },
        // BODY : les données de l'utilisateur sont converties en chaîne JSON
        // et incluses dans le corps de la requête.
        body: JSON.stringify(user),
    });

}

formLoginElement.addEventListener('submit', async (event) => {
    event.preventDefault()
    // empêche le comportement par défaut du formulaire de se produire,
    // ce qui empêche la page de se recharger.

    const data = new FormData(formLoginElement) 
    // permet de récupérer les valeurs du formulaire.

    const response = await login(data)

    const user = await response.json()
    
    if (user.token){
        sessionStorage.setItem('token', user.token);
        window.location.href ='./index.html';
    // s'il y a un token => se redirige vers index.html
    } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
    // sinon alerte
    }
})