// Sélecteurs index
const galleryElement = document.querySelector('.gallery');
const buttonContainerElement = document.querySelector('.btns-container');

// Sélecteurs modale 1
const mainModal = document.querySelector('#modal1');
const mainModalGalleryElement = document.querySelector('.modal1-gallery');
// Sélecteurs modale 2
const secondModal = document.querySelector('#modal2');

// Tableaux "works" et "categories" vides utilisés pour stocker les données de l'API
let works = []
let categories = []

// Variable pour savoir si la modale est ouverte ou non
let mainModalOpened = false; // False = fermée
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

// Nom des options selon l'id
const selectOptionCategories = (id, name) => {
    const selectElement = document.querySelector('.category-select')
    const optionElement = document.createElement('option');

    optionElement.value = id;
    optionElement.textContent = name;

    if (id === 0) {
    optionElement.innerHTML = '- Sélectionner une catégorie -';
    }
    
    selectElement.appendChild(optionElement);
}

// Créer les options du select à partir du tableau "categories"
const categoriesModal = (categories) => {
    selectOptionCategories(0,'')
    categories.forEach(optionElement => {
        selectOptionCategories(optionElement.id, optionElement.name)
    })
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
            deleteWork();
        });

        // Fonction pour supprimer un projet
        const deleteWork = async() => {
            let token = sessionStorage.getItem('token');
            let id = work.id;
            let figureElementTrash = trashElement.closest('figure');
            // closest = élément (ici 'figure') le plus proche dans l'ascendance de l'élément sélectionné (ici le trash)

            // appel de l'API pour l'id de chaque work
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                // method DELETE pour supprimer un projet
                method: "DELETE",
                headers: {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.status === 204) {
                figureElementTrash.remove();
                galleryElement.innerHTML = "";
                updateUI()
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


// MODALE 2 - POST
const addImageInput = document.querySelector('#add-image');
const addImageContainer = document.querySelector('.modal2-addimg');
const addImageButton = document.querySelector('.add-image-button');
const iconeImageElement = document.querySelector('.fa-image');
const textImageElement = document.querySelector('.add-image-text');
const titleFormElement = document.querySelector('#modal2-img-title');
const categoryFormElement = document.querySelector('#modal2-img-category')
const categoryOptionElement = document.querySelector('.select-option')
const validButtonElement = document.querySelector('.valid-button');

addImageInput.addEventListener('change', (e) => {
    const imageMaxSize = 4194304; // = 4Mo en octets
    
    if (e.target.files[0].size <= imageMaxSize) { // si la taille du fichier sélectionné est < ou = imageMaxSize
        addImageButton.style.display = 'none';
        addImageInput.style.display = 'none';
        iconeImageElement.style.display = 'none';
        textImageElement.style.display = 'none';
        
        // création de la miniature
        const miniatureContainer = document.createElement('div');
        miniatureContainer.setAttribute('id', 'miniature-container')
        const miniatureImage = document.createElement('img');
        miniatureImage.classList.add('miniature');
        
        //Source de l'image = une URL créée pour cette image
        miniatureImage.src = URL.createObjectURL(e.target.files[0]);
        
        miniatureContainer.appendChild(miniatureImage);
        addImageContainer.appendChild(miniatureContainer);
    } else {
        // sinon création du message d'erreur
        alert("La taille de l'image est supérieure à 4Mo")
        addImageInput.value = ""; // valeur de l'input remise à zéro
    }
})

// fonction pour le changement de couleur du bouton valider
const validationButtonChange = () => {
    if (addImageInput.value !== "" && titleFormElement.value !== "" && categoryFormElement.value !== "0") {
        validButtonElement.removeAttribute('disabled');
        validButtonElement.classList.add('valid-button-green');
    } else {
        validButtonElement.setAttribute('disabled', 'disabled');
        validButtonElement.classList.remove('valid-button-green');
    }
}

// Ajout d'écouteurs d'évènement pour que le bouton "Valider" change et s'active.
addImageInput.addEventListener('change', validationButtonChange);
titleFormElement.addEventListener('input', validationButtonChange);
categoryFormElement.addEventListener('change', validationButtonChange);

// ajout d'écouteur d'évènement si on peut cliquer sur le bouton
validButtonElement.addEventListener('click', (e) => {
    e.preventDefault();
    // lancer la fonction "newPost" avec les 3 paramètres du formulaire
    newPost(addImageInput, titleFormElement, categoryFormElement);
})

const newPost = async (addImageInput, titleFormElement, categoryFormElement) => {
    let token = sessionStorage.getItem('token');

    const file = addImageInput.files[0];
    const title = titleFormElement.value;
    const category = categoryFormElement.value;
    console.log(file, title, category)

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    const response = await fetch(`http://localhost:5678/api/works`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (response.ok) { // Statut 201 : Créé
        console.log(response)
        returnMainModal();
        await getWorks();
        mainModalGalleryElement.innerHTML = "";
        createModalWorks(works);
        galleryElement.innerHTML = "";
        createWorks(works);
    }
}

// sélection du bouton "ajouter photo" pour ouverture de la modale 2
mainModal.querySelector('.modal1-add-button').addEventListener('click', () => {
    openSecondModal(secondModal)
})

// selection de la croix pour la fermeture de la modale 1
mainModal.querySelector('.close-button').addEventListener('click', () => {
    closeModal(mainModal)
})

// fonction pour ouvrir la modale 2
const openSecondModal = (modal) => {
    if (secondModalOpened === true) return
    secondModalOpened = true;
    mainModal.style.display = 'none';
    secondModal.style.display = 'flex';
    modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.return-button').addEventListener('click', () => returnMainModal());
}

// Fonction pour revenir à la modale 1
const returnMainModal = () => {
    if (!secondModalOpened) return
    mainModalOpened = true;
    secondModalOpened = false;
    secondModal.style.display = 'none';
    mainModal.style.display = 'flex';
    clearForm();
}

// fonction de fermeture de la modale
const closeModal = (modal) => {
    if (modal.id === 'modal1') {
        if (!mainModalOpened) return
        mainModalOpened = false;
    }
    if (modal.id === 'modal2') {
        if(!secondModalOpened) return
        mainModalOpened = false;
    }
    modal.style.display = 'none';
    modal.querySelector('.close-button').removeEventListener('click', () => closeModal(modal));
    secondModalOpened = false;
    clearForm();
}

const clearForm = () => {
    const miniatureElement = document.querySelector('.miniature');
    if (miniatureElement !== null) {
        miniatureElement.remove();
        addImageInput.type = "";
        addImageInput.type = "file";
    }

    addImageButton.style.display = 'flex';
    iconeImageElement.style.display = 'flex';
    textImageElement.style.display = 'flex';

    titleFormElement.value = "";

    categoryFormElement.value = "0";

    validationButtonChange();
}

// Fonction qui permet de mettre à jour l'interface utilisateur
const updateUI = async() => {
    // initialise le tableau 'works' vide
    works = [];
    // attendre que get works se termine
    await getWorks()
    // pour lancer 'createWorks' avec les données récupérées.
    createWorks(works)
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
    // insérer les projets dans la modale 1
    createModalWorks(works);
    // insérer les catégories dans la modale 2
    categoriesModal(categories)
}

init()
