const books = [];
const RENDER_EVENT = "render-todo";
const BOOK_ID = "bookId";
const BOOK_INCOMPLETED_ID = "incompleteBookshelfList";
const BOOK_COMPLETED_ID = "completeBookshelfList";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK-APPS";

function tampilkanJam() {
  let tanggal = new Date(); // Mendapatkan waktu saat ini
  let jam = tanggal.getHours(); // Mendapatkan jam (0-23)
  let menit = tanggal.getMinutes(); // Mendapatkan menit (0-59)
  let detik = tanggal.getSeconds(); // Mendapatkan detik (0-59)
  let hari = tanggal.getDate(); // Mendapatkan tanggal (1-31)
  let bulan = tanggal.getMonth() + 1; // Mendapatkan bulan (0-11). Ditambah 1 karena Januari dimulai dari 0.
  let tahun = tanggal.getFullYear(); // Mendapatkan tahun (misalnya 2023)

  // //   Mengatur format tanggal agar memiliki dua digit angka (misalnya 01, 02, dst.)
  // if (hari < 10) {
  //   hari = "0" + hari;
  // }
  // if (bulan < 10) {
  //   bulan = "0" + bulan;
  // }
  // // Mengatur format waktu agar memiliki dua digit angka (misalnya 01, 02, dst.)
  // if (jam < 10) {
  //   jam = "0" + jam;
  // }
  // if (menit < 10) {
  //   menit = "0" + menit;
  // }
  // if (detik < 10) {
  //   detik = "0" + detik;
  // }

  jam = String(jam).padStart(2, "0");
  menit = String(menit).padStart(2, "0");
  detik = String(detik).padStart(2, "0");
  hari = String(hari).padStart(2, "0");
  bulan = String(bulan).padStart(2, "0");

  // Menampilkan waktu dalam elemen HTML dengan id "jam"
  document.getElementById("tanggal").innerHTML =
    jam + ":" + menit + ":" + detik + " " + hari + "/" + bulan + "/" + tahun;

  // Memperbarui waktu setiap detik (1000ms)
  setTimeout(tampilkanJam, 1000);
}

tampilkanJam();

const selesaiDibaca = document.getElementById("inputBookIsComplete");
selesaiDibaca.addEventListener("click", function () {
  if (selesaiDibaca.checked) {
    document.getElementById("submitStatus").innerText = "Belum selesai";
    document.getElementById("submitStatus").innerText = "Selesai";
  } else {
    document.getElementById("submitStatus").innerText = "Belum selesai";
    document.getElementById("submitStatus").innerText = "Belum selesai";
  }
});
const editselesaiDibaca = document.getElementById("inputBookIsComplete");
editselesaiDibaca.addEventListener("click", function () {
  if (selesaiDibaca.checked) {
    document.getElementById("submitStatusChange").innerText = "Belum selesai";
    document.getElementById("submitStatusChange").innerText = "Selesai";
  } else {
    document.getElementById("submitStatusChange").innerText = "Belum selesai";
    document.getElementById("submitStatusChange").innerText = "Belum selesai";
  }
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, bookTitle, isCompleted) {
  return {
    id,
    bookTitle,
    isCompleted,
  };
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function clearInput() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function createBook(bookObject) {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = bookObject.bookTitle;
  textBookTitle.classList.add("my_title");

  const textContainer = document.createElement("div");
  textContainer.classList.add("book_list");
  textContainer.append(textBookTitle);

  const containerAction = document.createElement("div");
  containerAction.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `book-${bookObject.id}`);
  container.append(textContainer, containerAction);

  if (bookObject.isCompleted) {
    const undoBotton = document.createElement("button");
    undoBotton.classList.add("yellow");
    undoBotton.innerText = "Belum Selesai";

    undoBotton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus";

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    containerAction.append(undoBotton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });
    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus";

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    containerAction.append(checkButton, trashButton);
  }
  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(generateID, bookTitle, isCompleted);
  books.push(bookObject);

  if (isCompleted) {
    document.getElementById(BOOK_COMPLETED_ID).append(books);
  } else {
    document.getElementById(BOOK_INCOMPLETED_ID).append(books);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("inputBook");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    clearInput();
  });
  const inputFormChange = document.getElementById("submitBookChange");
  inputFormChange.style.display = "none";

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});
