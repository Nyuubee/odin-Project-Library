const myLibrary = []
let editingBookId = null;

function Book(title, author, pages, status) {
    if (!new.target) {
        throw Error('You must use the "new" operator to call the constructor!');
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.id = crypto.randomUUID();
}
Book.prototype.info = function () {
    return `ID: ${this.id}, Book: ${this.title}, Author: ${this.author}, pages: ${this.pages}, Status: ${this.status}`
}

Book.prototype.toggleReadStatus = function () {
    this.status = this.status === "read" ? "unread" : "read";
};

function AddBookToLibrary(title, author, pages, status) {
    const newBook = new Book(title, author, pages, status);
    myLibrary.push(newBook);
}

AddBookToLibrary(`Daoist Gu Master`, 'Gu Zhen Ren', 2334, "read");
AddBookToLibrary(`Lord of the Mysteries`, 'Cuttlefish', 1392, "read");
AddBookToLibrary(`Shadow Slave`, 'G3', 3000, "read");
AddBookToLibrary(`Mother of learning`, 'nobody103', 106, "read");
AddBookToLibrary(`Regressor's tale of cultivation`, 'Tremendous', 694, "read");

const libraryGrid = document.querySelector(".library-grid");

const formBookTitle = document.getElementById("book-title");
const formBookAuthor = document.getElementById("book-author");
const formBookPages = document.getElementById("book-pages");
const bookForm = document.querySelector(".form");
const modalForm = document.getElementById("modal");

const addBookButton = document.getElementById("add-book-btn");
const closeModalButton = document.querySelector(".close-modal-btn");
const clearModalButton = document.querySelector(".clear-modal-btn");

function handleForm(event) {
    event.preventDefault();

    const bookTitle = formBookTitle.value;
    const bookAuthor = formBookAuthor.value;
    const bookPages = Number(formBookPages.value);
    const checkedStatus = document.querySelector(`input[name="book-status"]:checked`);
    const bookStatus = checkedStatus ? checkedStatus.value : "unread";

    if (editingBookId === null) {
        AddBookToLibrary(bookTitle, bookAuthor, bookPages, bookStatus);
    }
    else {
        const bookToEdit = myLibrary.find((book) => book.id === editingBookId);

        if (bookToEdit) {
            bookToEdit.title = bookTitle;
            bookToEdit.author = bookAuthor;
            bookToEdit.pages = bookPages;
            bookToEdit.status = bookStatus;
        }
    }

    bookForm.reset();

    displayBooks();
}

function deleteBook(book) {
    const bookIndex = myLibrary.findIndex((haha) => haha.id === book.id)

    if (bookIndex !== -1) {
        myLibrary.splice(bookIndex, 1);
    }

    displayBooks();
}

function displayBooks() {
    libraryGrid.innerHTML = "";
    myLibrary.forEach((book) => {
        const bookCard = document.createElement("div");
        const bookTitle = document.createElement("p");
        const bookAuthor = document.createElement("p");
        const bookPages = document.createElement("p");
        const bookStatus = document.createElement("p");
        const bookID = document.createElement("p");

        const buttonContainer = document.createElement("div");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        const toggleButton = document.createElement("button");
        toggleButton.textContent = `Status: ${book.status}`;
        toggleButton.classList.add("btn-toggle");

        // Listen for clicks to toggle status and re-render
        toggleButton.addEventListener("click", () => {
            book.toggleReadStatus();
            displayBooks();
        });

        bookCard.classList.add("card");
        bookCard.setAttribute("style", "background-color: lightblue;")

        bookTitle.textContent = `${book.title}`;
        bookAuthor.textContent = `${book.author}`;
        bookPages.textContent = `${book.pages}`;
        bookStatus.textContent = `${book.status}`;
        bookID.textContent = `${book.id}`;
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";

        buttonContainer.classList.add("card-actions");
        editButton.classList.add("btn-edit");
        deleteButton.classList.add("btn-delete");

        bookCard.dataset.id = book.id;


        libraryGrid.appendChild(bookCard);
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookPages);
        bookCard.appendChild(bookStatus);
        bookCard.appendChild(buttonContainer);
        bookCard.appendChild(toggleButton);
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        editButton.addEventListener("click", () => {
            editingBookId = book.id;
            formBookTitle.value = book.title;
            formBookAuthor.value = book.author;
            formBookPages.value = Number(book.pages);
            if (book.status === "read") {
                document.getElementById("status-read").checked = true;
            }
            else {
                document.getElementById("status-unread").checked = true;
            }

            modalForm.classList.add("active");
        })

        deleteButton.addEventListener("click", () => {
            deleteBook(book);
        });


    })
}

displayBooks();


bookForm.addEventListener("submit", (event) => {
    handleForm(event);
    modalForm.classList.remove("active");
});

addBookButton.addEventListener("click", () => {
    editingBookId = null;
    bookForm.reset();
    modalForm.classList.add("active");
})

closeModalButton.addEventListener("click", () => {
    modalForm.classList.remove("active");
    bookForm.reset();
})

clearModalButton.addEventListener("click", () => {
    bookForm.reset();
})

modalForm.addEventListener("click", (e) => {
    if (e.target === modalForm) {
        modalForm.classList.remove("active");
        bookForm.reset();
    }
})

