// Sélecteur de la div avec la classe "gallery"
const galleryElement = document.querySelector('.gallery');

// Tableau "works" vide utilisé pour stocker les données de l'API
let works = []

// Fonction fetch pour récupérer l'API via url (fetch then)
const getWorks = async () => {
    await fetch("http://localhost:5678/api/works")
    /* "await" est utilisé pour suspendre l'exécution de 
    la fonction jusqu'à ce que la demande de récupération 
    soit terminée et que la réponse soit reçue */
    .then(response => response.json())
    .then(dataProjects => works.push(...dataProjects))
    .catch(error => console.log(error))
}

// Création des éléments HTML dynamiquement
const createWorks = (works) => {
    works.forEach(work => {
        const figureElement = document.createElement('figure')
        const imgElement = document.createElement('img')
        const figCaptionElement = document.createElement('figcaption')

        imgElement.src = work.imageUrl;
        imgElement.alt = work.title

        figCaptionElement.textContent = work.title;

        figureElement.appendChild(imgElement)
        figureElement.appendChild(figCaptionElement)
        galleryElement.appendChild(figureElement)
    });
}

const init = async () => {
    await getWorks()
    createWorks(works)
}

init()
