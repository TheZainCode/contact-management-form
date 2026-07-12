// Next Project: Contact Management Form
const form = document.querySelector(".form");
const inputName = document.querySelector(".inputName");
const nameMessage = document.querySelector(".nameMessage");
const inputEmail = document.querySelector(".inputEmail");
const emailMessage = document.querySelector(".emailMessage");
const inputNumber = document.querySelector(".inputNumber");
const numberMessage = document.querySelector(".numberMessage");
const inputCategory = document.querySelector(".inputCategory");
const categoryMessage = document.querySelector(".categoryMessage");
const inputAddress = document.querySelector(".inputAddress");
const addressMessage = document.querySelector(".addressMessage");
const contactList = document.querySelector(".contactList");
const inputFavorite = document.querySelector(".inputFavorite");
const favoriteMessage = document.querySelector(".favoriteMessage");
const inputStatus = document.querySelectorAll(".status");
const statusMessage = document.querySelector(".statusMessage");
const submitBtn = document.querySelector(".submitBtn");
const resetBtn = document.querySelector(".resetBtn");
const message = document.querySelector(".message");

let contactsArray = [];
let nextId = 1;
let editMode = false;
let editId = null;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =========================
// EVENT LISTENERS
// =========================
inputName.addEventListener("input", validateName);
inputEmail.addEventListener("input", validateEmail);
inputNumber.addEventListener("input", validateNumber);
inputCategory.addEventListener("change", validateCategory);
inputAddress.addEventListener("input", validateAddress);
inputFavorite.addEventListener("change", updateFavoriteMessage);

inputStatus.forEach(one => {
    one.addEventListener("change", validateStatus);
});

// =========================
// VALIDATION FUNCTIONS
// =========================
function validateName() {
    const name = inputName.value.trim();
    const nameIsValid = name !== "" && name.length >= 3 && /^[A-Za-z\s]+$/.test(name);

    if (nameIsValid) {
        nameMessage.textContent = "";
        return true;
    } else {
        nameMessage.textContent = "Name must be 3+ letters & alphabetic only";
        return false;
    }
}

function validateEmail() {
    const email = inputEmail.value.trim();
    const isEmailValid = email !== "" && emailRegex.test(email);

    if (isEmailValid) {
        emailMessage.textContent = "";
        return true;
    } else {
        emailMessage.textContent = "Please enter a valid email address";
        return false;
    }
}

function validateNumber() {
    const number = inputNumber.value.trim();
    const isNumberValid = number !== "" && /^03\d{9}$/.test(number);

    if (isNumberValid) {
        numberMessage.textContent = "";
        return true;
    } else {
        numberMessage.textContent = "Format must be Pakistani (03XXXXXXXXX)";
        return false;
    }
}

function validateCategory() {
    if (inputCategory.value === "select") {
        categoryMessage.textContent = "Please select a valid category";
        return false;
    } else {
        categoryMessage.textContent = "";
        return true;
    }
}

function validateAddress() {
    const address = inputAddress.value.trim();
    const isAddressValid = address !== "" && address.length >= 5 && address.length <= 50;

    if (isAddressValid) {
        addressMessage.textContent = "";
        return true;
    } else {
        addressMessage.textContent = "Address required (5 to 50 characters)";
        return false;
    }
}

function validateStatus() {
    const status = document.querySelector('input[name="status"]:checked');

    if (status !== null) {
        statusMessage.textContent = "";
        return true;
    } else {
        statusMessage.textContent = "Please select an account status";
        return false;
    }
}

// favorite is not validation — just UI feedback
function updateFavoriteMessage() {
    if (inputFavorite.checked) {
        favoriteMessage.textContent = "⭐ Added to Favorites!";
    } else {
        favoriteMessage.textContent = "";
    }
}

// =========================
// MESSAGE HELPERS
// =========================
function clearFieldMessages() {
    const allMsgs = [
        nameMessage,
        emailMessage,
        numberMessage,
        categoryMessage,
        addressMessage,
        statusMessage,
        favoriteMessage
    ];

    allMsgs.forEach(msg => msg.textContent = "");
}

function clearMainMessage() {
    message.textContent = "";
    message.className = "message";
}

// =========================
// RENDER CONTACTS
// =========================
function renderContacts() {
    contactList.innerHTML = "";

    if (contactsArray.length === 0) {
        contactList.innerHTML = `<p style="color: gray; font-style: italic;">No contacts added yet.</p>`;
        return;
    }

    contactsArray.forEach(contact => {
        const li = document.createElement("li");
        li.className = "contactCard";
        li.dataset.id = contact.id;

        li.innerHTML = `
            <h3>
                <span>${contact.name} ${contact.favorite ? "⭐" : ""}</span>
                <span class="badge ${contact.status === "active" ? "badge-active" : "badge-inactive"}">
                    ${contact.status.toUpperCase()}
                </span>
            </h3>
            <p><strong>Category:</strong> ${contact.category.toUpperCase()}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            <p><strong>Address:</strong> ${contact.address}</p>
            <div class="cardActions">
                <button type="button" class="editBtn">Edit</button>
                <button type="button" class="deleteBtn">Delete</button>
            </div>
        `;

        li.querySelector(".deleteBtn").addEventListener("click", () => deleteContact(contact.id));
        li.querySelector(".editBtn").addEventListener("click", () => startEditContact(contact.id));

        contactList.appendChild(li);
    });
}

// =========================
// DELETE CONTACT
// =========================
function deleteContact(id) {
    contactsArray = contactsArray.filter(contact => contact.id !== id);

    if (editMode && editId === id) {
        stopEditMode();
        form.reset();
    }

    renderContacts();
    message.textContent = "Contact Deleted Successfully!";
    message.className = "message success";
}

// =========================
// EDIT CONTACT
// =========================
function startEditContact(id) {
    const contact = contactsArray.find(c => c.id === id);
    if (!contact) return;

    inputName.value = contact.name;
    inputEmail.value = contact.email;
    inputNumber.value = contact.phone;
    inputCategory.value = contact.category;
    inputAddress.value = contact.address;
    inputFavorite.checked = contact.favorite;

    document.querySelector(`input[name="status"][value="${contact.status}"]`).checked = true;

    editMode = true;
    editId = id;

    submitBtn.textContent = "Update Contact";
    submitBtn.style.backgroundColor = "orange";

    clearFieldMessages();
    clearMainMessage();
    updateFavoriteMessage();
}

function stopEditMode() {
    editMode = false;
    editId = null;
    submitBtn.textContent = "Submit";
    submitBtn.style.backgroundColor = "blue";
}

// =========================
// FORM SUBMIT
// =========================
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameOk = validateName();
    const emailOk = validateEmail();
    const numberOk = validateNumber();
    const categoryOk = validateCategory();
    const addressOk = validateAddress();
    const statusOk = validateStatus();

    if (nameOk && emailOk && numberOk && categoryOk && addressOk && statusOk) {
        const selectedStatus = document.querySelector('input[name="status"]:checked').value;

        if (editMode) {
            const contact = contactsArray.find(c => c.id === editId);

            if (contact) {
                contact.name = inputName.value.trim();
                contact.email = inputEmail.value.trim();
                contact.phone = inputNumber.value.trim();
                contact.category = inputCategory.value;
                contact.address = inputAddress.value.trim();
                contact.status = selectedStatus;
                contact.favorite = inputFavorite.checked;
            }

            message.textContent = "Contact Updated Successfully!";
            message.className = "message success";

            stopEditMode();
        } else {
            const newContact = {
                id: nextId++,
                name: inputName.value.trim(),
                email: inputEmail.value.trim(),
                phone: inputNumber.value.trim(),
                category: inputCategory.value,
                address: inputAddress.value.trim(),
                status: selectedStatus,
                favorite: inputFavorite.checked
            };

            contactsArray.push(newContact);

            message.textContent = "Contact Added Successfully!";
            message.className = "message success";
        }

        renderContacts();
        form.reset();
        clearFieldMessages();
        updateFavoriteMessage();
    } else {
        message.textContent = "Please fill all fields correctly.";
        message.className = "message error";
    }
});

// =========================
// RESET
// =========================
resetBtn.addEventListener("click", () => {
    form.reset();
    stopEditMode();
    clearFieldMessages();
    clearMainMessage();
    updateFavoriteMessage();
});

// initial render
renderContacts();
