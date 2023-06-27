// Sélecteur de la div avec la classe "gallery"
const galleryElement = document.querySelector('.gallery');
const buttonContainerElement = document.querySelector('.btns-container');
// Rajout session
const mainModal = document.querySelector('#modal1');
const mainModalGalleryElement = document.querySelector('.modal1-gallery');

// Tableaux "works" et "categories" vides utilisés pour stocker les données de l'API
let works = []
let categories = []
let mainModalOpened = false;

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
        const figureElement = document.createElement('figure')
        const imgElement = document.createElement('img');
        const trashElement = document.createElement('span')

        imgElement.src = work.imageUrl;
        imgElement.classList.add('modal-img')

        trashElement.textContent = 'pb'
        trashElement.classList.add('trash')
        trashElement.addEventListener('click', () => {
            console.log('test', work.id)
            // fonction de suppression, qui a probablement besoin de données comme l'id pour le delete en BDD
        })

        figureElement.classList.add('modal-figure')

        figureElement.appendChild(imgElement)
        figureElement.appendChild(trashElement)

        mainModalGalleryElement.appendChild(figureElement)
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
        const createButton = (text) => {
            const button = document.createElement('button');
            button.textContent = text;
            return button;
          };
      
          const createIcon = () => {
            const icon = document.createElement('i');
            icon.classList.add('fa-regular', 'fa-pen-to-square');
            return icon;
          };
      
          const createText = (content) => {
            const text = document.createElement('p');
            text.textContent = content;
            return text;
          };
      
          const editionButton = createButton();
          editionButton.classList.add('btn-edition');
          editionButton.appendChild(createIcon());
          editionButton.appendChild(createText('Mode édition'));
      
          const publishButton = createButton('publier les changements');
          publishButton.classList.add('btn-publish');
      
          editionElement.appendChild(editionButton);
          editionElement.appendChild(publishButton);
      
          const editIconImage = createIcon();
          const editTextImage = createText('modifier');
          editImage.appendChild(editIconImage);
          editImage.appendChild(editTextImage);
      
          const editIconArticle = createIcon();
          const editTextArticle = createText('modifier');
          editArticle.appendChild(editIconArticle);
          editArticle.appendChild(editTextArticle);
      
          const editIconWorks = createIcon();
          const editTextWorks = createText('modifier');
          editWorks.appendChild(editIconWorks);
          editWorks.appendChild(editTextWorks);

          editWorks.addEventListener('click', (e) => {
            e.preventDefault()
            if (mainModalOpened) return
            mainModalOpened= true
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

mainModal.querySelector('.close-button').addEventListener('click', () => {
    closeModal(mainModal)
})


// MODALE 1 - EDITION GALERIE
// const openModal = () => {
//     const openModalLink = document.querySelector('.modal-open');

//     openModalLink.addEventListener('click', () => {
//         const displayModalOn = document.querySelector('.modal1');
//         displayModalOn.classList.remove('modal1-off');
//         createModalGallery(worksModal);

//         // Ecoute du click sur la croix pour fermer
//         const closeModalLink = document.querySelector('.fa-xmark');
//         closeModalLink.addEventListener('click', closeModal);

//         // Ecoute du click sur le bouton '+ ajouter photo'
//         const openNewModal = document.querySelector('.modal1-add-button');
//         openNewModal.addEventListener('click', openModalAdd);
//     })

// }

// const closeModal = () => {
//         const hideModal = document.querySelector('.modal1');
//         hideModal.classList.add('.modal1-off');
// }

const closeModal = (modal) => {
    if (modal.id === 'modal1') {
        if (!mainModalOpened) return
        mainModalOpened= false
    }
    modal.style.display = 'none';
    modal.querySelector('.close-button').removeEventListener('click', () => closeModal(modal))
}

// let worksModal = works
// const worksModalGallery = document.querySelector('.modal1-gallery');

// Création de la galerie dynamiquement
// const createModalGallery = (worksModal) => {
//     worksModal.forEach(work => {
//         const figureModalElement = document.createElement('figure');
//         const imgModalElement = document.createElement('img');
//         const removeElement = document.createElement('i');
//         removeElement.classList.add('fa-solid', 'fa-trash-can');
//         const moveElement = document.createElement('i');
//         moveElement.classList.add('fa-solid', 'fa-arrows-up-down-left-right')
//         const figcaptionModalElement = document.createElement('figcaption');

//         imgModalElement.src = work.imageUrl;
//         imgModalElement.alt = work.title;
//         figcaptionModalElement.textContent = 'éditer';

//         figcaptionModalElement.appendChild(imgModalElement);
//         figcaptionModalElement.appendChild(figcaptionModalElement);
//         worksModalGallery.appendChild(figureModalElement);
//     })
// }

// const openModalAdd = () => {
//     const hideFirstModal = document.querySelector('.modal1');
//     hideFirstModal.classList.add('.modal1-off');

//     const openModal2 = document.querySelector('.modal2');
//     openModal2.classList.remove('.modal2-off');        
// }


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
    // openModal();
    createModalWorks(works)
}

init()
