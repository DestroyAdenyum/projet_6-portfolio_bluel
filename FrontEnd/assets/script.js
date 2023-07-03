// Sélecteur de la div avec la classe "gallery"
const galleryElement = document.querySelector('.gallery');
const buttonContainerElement = document.querySelector('.btns-container');
// Rajout session
const mainModal = document.querySelector('#modal1');
const mainModalGalleryElement = document.querySelector('.modal1-gallery');
const secondModal = document.querySelector('#modal2');

// Tableaux "works" et "categories" vides utilisés pour stocker les données de l'API
let works = []
let categories = []
let mainModalOpened = false;
let secondModalOpened = false;

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

const createModalWorks = (works) => {
    works.forEach(work => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        const figCaptionElement = document.createElement('figcaption');
        const trashElement = document.createElement('span');
        const trashIcon = document.createElement('i');
        const arrowsElement = document.createElement('span');
        const arrowsIcon = document.createElement('i');
        
        figureElement.classList.add('modal1-figure');
        trashElement.classList.add('trash');
        trashIcon.classList.add('fa-solid', 'fa-trash-can');
        arrowsElement.classList.add('arrows')
        arrowsIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right')

        imgElement.src = work.imageUrl;
        imgElement.classList.add('modal1-img');

        figCaptionElement.textContent = 'éditer';

        trashElement.addEventListener('click', () => {
            console.log('test', work.id)
            // fonction de suppression, qui a probablement besoin de données comme l'id pour le delete en BDD
            deleteWork();
        });

        const deleteWork = async() => {
            let token = sessionStorage.getItem('token');
            let id = work.id;
            let figureElementTrash = trashElement.closest('figure');
            // closest = element le plus proche dans l'ascendance de l'élément

            // appel de l'API pour l'id de chaque work
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                // method DELETE pour supprimer un projet
                method: "DELETE",
                headers: {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.ok) {
                figureElementTrash.remove();
                galleryElement.innerHTML = "";
                await getWorks();
            }
        }

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figCaptionElement);
        trashElement.appendChild(trashIcon);
        arrowsElement.appendChild(arrowsIcon);
        figureElement.appendChild(trashElement);
        figureElement.appendChild(arrowsElement);

        mainModalGalleryElement.appendChild(figureElement);
    })
}

// User connecté
const connected = () => {
    // Stockage du token
    let token = sessionStorage.getItem('token');
    
    // Selecteurs des différents éléments HTML
    const editionElement = document.querySelector('#edition');
    const editImage = document.querySelector('.editImage');
    const editArticle = document.querySelector('.editArticle');
    const editWorks = document.querySelector('.editWorks');

    if (token) {
        editWorks.addEventListener('click', (e) => {
            e.preventDefault()
            if (mainModalOpened) return
            mainModalOpened = true
            mainModal.style.display = "flex"
        })

        // Changement du texte "login"
        const loginLink = document.querySelector('.loginLink');
        loginLink.textContent = "logout";

        // Création du lien de déconnexion
        const logoutLink = document.querySelector('#logoutLink');
        logoutLink.addEventListener('click', () => {
            sessionStorage.removeItem('token');
            window.location.href = './login.html';
        })

        // Disparition des filtres
        const filtersWorks = document.querySelector('.btns-container');
        filtersWorks.style.display = 'none';
    } else {
        editionElement.style.display = 'none';

        editImage.style.display = 'none';

        editArticle.style.display = 'none';

        editWorks.style.display = 'none';
    }
}

// sélection du bouton "ajouter photo" pour ouverture de la modale 2
mainModal.querySelector('.modal1-add-button').addEventListener('click', () => {
    openSecondModal(secondModal)
})

secondModal.querySelector('.return-button').addEventListener('click', () => {
    returnMainModal(secondModal)
})

// selection de la croix pour la fermeture de la modale
mainModal.querySelector('.close-button').addEventListener('click', () => {
    closeModal(mainModal)
})

secondModal.querySelector('.close-button').addEventListener('click', () => {
    closeModal(secondModal)
})

const openSecondModal = (modal) => {
    mainModal.style.display = 'none';
    secondModal.style.display = 'flex';
    modal.querySelector('.modal1-add-button').removeEventListener('click', () => openSecondModal(modal));
    modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
}

const returnMainModal = () => {
    secondModal.style.display = 'none';
    mainModal.style.display = 'flex';
}

// fonction de fermeture de la modale
const closeModal = (modal) => {
    if (modal.id === 'modal1') {
        if (!mainModalOpened) return
        mainModalOpened = false
    }
    modal.style.display = 'none';
    modal.querySelector('.close-button').removeEventListener('click', () => closeModal(modal))
}

// Initialisation de la page
const init = async () => {
    // Attend que 'getWorks' et 'getCategories' soient récupérés
    await getWorks();
    await getCategories();
    // ensuite mettre les projets et les filtres en place,
    createWorks(works);
    createButtonFilter(categories);
    // faire appel à la fonction "connecté"
    connected();
    // insérer les projets dans la modale
    createModalWorks(works);
}

init()
