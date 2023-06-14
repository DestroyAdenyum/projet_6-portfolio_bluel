// Sélecteur de la div avec la classe "gallery"
const galleryElement = document.querySelector('.gallery');
const buttonContainerElement = document.querySelector('.btns-container');

// Tableaux "works" et "categories" vides utilisés pour stocker les données de l'API
let works = []
let categories = []

// Fonction fetch pour récupérer les projets
const getWorks = async () => {
    await fetch("http://localhost:5678/api/works")
    /* "await" est utilisé pour suspendre l'exécution de 
    la fonction jusqu'à ce que la demande de récupération 
    soit terminée et que la réponse soit reçue */
    .then(response => response.json())
    .then(dataProjects => works.push(...dataProjects))
    .catch(error => console.log(error))
}

// Fonction fetch pour appeler les catégories de projet
const getCategories = async () => {
    await fetch("http://localhost:5678/api/categories")
    .then(response2 => response2.json())
    .then(dataFilters => categories.push(...dataFilters))
    .catch(error2 => console.log(error2))
}

// Création un bouton de filtre
const createButton = (id, name) => {
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('btn');
    // Texte du bouton = name (dans "category" de l'API)
    buttonElement.textContent = name;
    // dataset (représente tous les attributs "data-*" d'un élément) = id (dans "category")
    buttonElement.dataset.id = id;

    // Bouton actif pour "Tous" de base
    if (id === 0) {
        buttonElement.classList.add('btn-active')
    }

    // Evènement au click
    buttonElement.addEventListener('click', () => {
        // Selection de tous les boutons
       const allButtons = document.querySelectorAll('.btn');
       allButtons.forEach((btn, index) => {
            // On enlève en 1er la classe
            btn.classList.remove('btn-active')
            if (id === index) {
            // Si id = index activation de la classe
            btn.classList.add('btn-active')
            }
        })

        // Si index est 0
        if (id === 0) {
        // Mise à jour de l'affichage
        galleryElement.innerHTML = '';
        // Affichage de tous les projets dans 'tous'
        return createWorks(works)
        }
    
        // Création d'un nouveau tableau works
        // pour filtrer selon l'id de la catégorie
        const newWorksArray = works.filter(work => work.categoryId === Number(id))
        // Mise à jour de l'affichage
        galleryElement.innerHTML = '';
        createWorks(newWorksArray)
    })

    buttonContainerElement.appendChild(buttonElement);
}

// Créer les différents bouton de filtre
const createButtonFilter = (categories) => {
    createButton(0, 'Tous')
    categories.forEach(button => {
        createButton(button.id, button.name)
    });
}

// Création des éléments HTML des projets dynamiquement
const createWorks = (works) => {
    works.forEach(work => {
        // Création de la balise contenant un projet
        const figureElement = document.createElement('figure')
        // Création du contenu de la balise
        const imgElement = document.createElement('img')
        const figCaptionElement = document.createElement('figcaption')
        
        // Sources du contenu
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;
        
        figCaptionElement.textContent = work.title;
        
        // Rattachement de la balise à la galerie
        figureElement.appendChild(imgElement)
        figureElement.appendChild(figCaptionElement)
        galleryElement.appendChild(figureElement)
    });
}


const init = async () => {
    // Attend que 'getWorks' et 'getCategories soient récupérés
    await getWorks();
    await getCategories();
    // et ensuite mettre les projets et les filtres en place
    createWorks(works);
    createButtonFilter(categories);
}

init()
