const usersUrl = "https://randomuser.me/api/?results=12&nat=US";
let fetchedUsers = [];

//Run Get Users from the random user generator and display on page
try {
    getUsers(usersUrl);
} catch (e) {
    console.log(e.message);
}

/**
 * Gets the users from the random user generator.
 * Creates users from the random users generated.
 * Adds the users to the page.
 * Adds the search bar to the page. 
 * @param {string} url 
 */
async function getUsers(url) {
    await fetch(url)
        .then(response => response.json())
        .then(data => createUser(data.results))
        .then(addUsersToPage)
        .then(addSearch);
}

/**
 * Adds the search bar to the page
 */
function addSearch() {
    let form = document.createElement("form");
    form.noValidate = true;
    form.addEventListener('submit', search);
    let inputSubmit = document.createElement("input");
    let inputText = document.createElement("input");
    inputText.type = "search";
    inputText.id = "search-input";
    inputText.classList.add("search-input");
    inputText.placeholder = "Search...";
    inputSubmit.type = "submit";
    inputSubmit.id = "search-submit";
    inputSubmit.classList.add("search-submit");
    inputSubmit.value = "🔍";
    form.append(inputText);
    form.append(inputSubmit);
    //console.log(form);
    document.getElementsByClassName("search-container")[0].append(form);
}


/**
 * Searches for the string enetered by the user and filters the users on the page
 * @param {Event} e 
 */
function search(e) {
    const val = e.target[0].value;
    const cards = document.getElementsByClassName("card");
    let foundUsers = [];
    let noMatchUsers = [];
    fetchedUsers.forEach(user => {
        const name = user.name.toLowerCase();
        if(name.includes(val.toLowerCase())) {
            foundUsers.push(user.id);
        } else {
            noMatchUsers.push(user.id);
        };
    });
    for (let card of cards) {
        foundUsers.forEach(user => {
            //console.log(`Card ID: ${card.id} and User: ${user}`);
            if(foundUsers.includes(card.id)){
                card.classList.remove("hidden");
                //console.log(card.classList);
            } else {
                card.classList.add("hidden");
            }
        });
    }
}

/**
 * Creates an array of users from the returned data from the API
 * @param {Promise} data 
 */
function createUser(data) {
    //console.log(data);
    for (let user of data) {
        fetchedUsers.push(new User(user.id.value,
                                   user.name.first + " " + user.name.last, 
                                   user.email, 
                                   user.phone,
                                   user.dob.date,
                                   user.location.street.number + " " + user.location.street.name,
                                   user.location.city,
                                   user.location.state,
                                   user.location.postcode,
                                   user.picture.medium,
                                   user.picture.thumbnail 
        ));
    }
}


/**
 * Adds the html for the users to the gallery
 */
function addUsersToPage() {
    const users = fetchedUsers.map(user => `
        <div id="${user.id}" class="card">
            <div class="card-img-container">
                <img class="card-img" src="${user.pictureThumb}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.city}, ${user.state}</p>
            </div>
        </div>
        <div class="modal-container hidden">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.pictureMedium}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">${user.address()}</p>
                    <p class="modal-text">Birthday: ${user.birthday}</p>
                </div>
            </div>

            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `).join('');
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = users;
    addOnClick();
}

/**
 * Adds the on click event listeners
 */
function addOnClick() {
    const cards = document.getElementsByClassName("card");
    for (let card of cards) {
        card.addEventListener('click', (e) => {
            let modal;
            if (e.target.classList === null || !e.target.classList.contains("card")) {
                modal = e.target.closest(".card");
            } else {
                modal = e.target;
            }
            modal.nextElementSibling.classList.remove("hidden");
        });
    };
    const closeButtons = document.getElementsByClassName("modal-close-btn");
    for (let btn of closeButtons) {
        btn.addEventListener('click', (e) => {
            e.target.closest(".modal-container").classList.add("hidden");
        });
    }
    const nextButtons = document.getElementsByClassName("modal-next");
    const prevButtons = document.getElementsByClassName("modal-prev");
    
    for (let btn of nextButtons) {
        btn.addEventListener('click', (e) => {
            e.target.closest(".modal-container").classList.add("hidden");
            if(e.target.closest(".modal-container").nextElementSibling != null) {
                e.target.closest(".modal-container").nextElementSibling.nextElementSibling.classList.remove("hidden");
            } 
        });
    }

    for (let btn of prevButtons) {
        btn.addEventListener('click', (e) => {
            e.target.closest(".modal-container").classList.add("hidden");
            if(e.target.closest(".modal-container").previousElementSibling.previousElementSibling != null) {
                e.target.closest(".modal-container").previousElementSibling.previousElementSibling.classList.remove("hidden");
            } 
            
        });
    }
}

/**
 * Adds the close modal event listener
 * @param {Event} e 
 */
function closeModal(e) {
    e.target.parent.parent.classList.add("hidden");
}


/**
 * Class to use for users returned from the random user generator
 */
class User {
    constructor(id, name, email, phone, birthday, street, city, state, postcode, pictureMedium, pictureThumb) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = this.formatPhone(phone);
        this.birthday = this.formatBirthday(birthday);
        this.street = street;
        this.city = city;
        this.state = state;
        this.postcode = postcode;
        this.pictureMedium = pictureMedium;
        this.pictureThumb = pictureThumb;
    }

    formatPhone(phone) {
        return phone.replace("-", " ");
    }
    
    formatBirthday(date) {
        //1954-11-05T01:11:26.209Z
        return date.substring(5,7) + "/" + date.substring(8,10) + "/" + date.substring(0,4);
    }

    address() {
        return `${this.street}, ${this.city}, ${this.state} ${this.postcode}`; 
    }
}