function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  // For admin.html agar koi admin se customer profile ka path type karke jane ki koshish kare
  if (window.location.pathname.includes("admin.html")) {
    if (currentUser.role !== "admin") {
      window.location.href = "profile.html";
    }
  }

  // For profile.html agar koi customer profile se kisi admin ke path ko type karke jane ki koshish kare
  if (window.location.pathname.includes("profile.html")) {
    if (currentUser.role === "admin") {
      window.location.href = "admin.html";
    }
  }

  return currentUser;
}
const currentUser = checkAuth();
console.log(currentUser);

const addProductBtn = document.getElementById("addProductBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const cancelAddProductBtn = document.getElementById("cancelAddProductBtn");
const updateProductBtn = document.getElementById("updateProductBtn");
const cancelEditProductBtn = document.getElementById("cancelEditProductBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const productContainer = document.getElementById("productContainer");

let products = JSON.parse(localStorage.getItem("products")) || [];
renderProducts();
let currentEditIndex = -1;
let currentDeleteIndex = -1;

// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// Add Product Popup
addProductBtn.addEventListener("click", () => {
  document.getElementById("addProductPopup").classList.remove("hidden");
});

//Cancel Add product popup
cancelAddProductBtn.addEventListener("click", () => {
  document.getElementById("addProductPopup").classList.add("hidden");
});

//Jab bhi save product button pe click karenge to new product ka object bnkr product save ho jaega
saveProductBtn.addEventListener("click", () => {
  const product = {
    name: document.getElementById("addProductName").value.trim(),
    imgUrl: document.getElementById("addProductImgUrl").value,
    category: document.getElementById("addProductCategory").value.trim(),
    price: document.getElementById("addProductPrice").value,
    availability: document.getElementById("addProductAvailability").value,
    id: Date.now(),
  };

  products.push(product);
  save();
  renderProducts();
  document.getElementById("addProductPopup").classList.add("hidden");
});

// Edit Product Popup
function showEditPopup(index) {
  currentEditIndex = index;
  const product = products[index];

  document.getElementById("editProductName").value = product.name;
  document.getElementById("editProductImgUrl").value = product.imgUrl;
  document.getElementById("editProductCategory").value = product.category;
  document.getElementById("editProductPrice").value = product.price;
  document.getElementById("editProductAvailability").value =
    product.availability;
  document.getElementById("editProductPopup").classList.remove("hidden");
}

cancelEditProductBtn.addEventListener("click", () => {
  document.getElementById("editProductPopup").classList.add("hidden");
});

updateProductBtn.addEventListener("click", () => {
  if (currentEditIndex !== -1) {
    products[currentEditIndex] = {
      name: document.getElementById("editProductName").value,
      imgUrl: document.getElementById("editProductImgUrl").value,
      category: document.getElementById("editProductCategory").value,
      price: document.getElementById("editProductPrice").value,
      availability: document.getElementById("editProductAvailability").value,
    };
    save();
    renderProducts();
    document.getElementById("editProductPopup").classList.add("hidden");
  }
});

// Delete Confirmation popup
function showDeleteConfirmation(index) {
  currentDeleteIndex = index;
  document.getElementById("deleteConfirmPopup").classList.remove("hidden");
}

// cancel button for delete confirmation popup
cancelDeleteBtn.addEventListener("click", () => {
  document.getElementById("deleteConfirmPopup").classList.add("hidden");
});

// confirm delete  button
confirmDeleteBtn.addEventListener("click", () => {
  if (currentDeleteIndex !== -1) {
    products.splice(currentDeleteIndex, 1);
    renderProducts();
    document.getElementById("deleteConfirmPopup").classList.add("hidden");
  }
  save();
});

// Render Products
function renderProducts() {
  document.getElementById(
    "username"
  ).innerHTML = `Admin:${currentUser.username}`;
  productContainer.innerHTML = "";
  products.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.classList.add(
      "shadow-xl",
      "rounded-lg",
      "w-[90%]",
      "border",
      "border-[#327825]",
      "max-h-[450px]",
      "mt-4",
      "block",
      "mx-auto",
      "relative"
    );
    productCard.innerHTML = `
       <div class="w-[100%] h-[100%] p-2 md:py-4">
        <img class="h-[45%] w-full object-cover rounded-lg my-auto mx-auto block" src="${product.imgUrl}" alt="Product Image" class="w-full h-40 object-cover rounded-md col-span-1">
        <div class="p-2">
            <h2 class="sm:text-md md:text-lg font-bold text-orange-400">${product.name}</h2>
            <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p class="text-sm md:text-md text-"><strong>Category:</strong> ${product.category}</p>
                <p class="text-sm md:text-md text-"><strong>Price:</strong> ₹${product.price}</p>
                <p class="text-sm text-"><strong>Supply:</strong> ${product.availability}</p>
            </div>
            <div class="btns absolute bottom-4 right-4 gap-4">
                <button class="edit-btn text-xs">
                    <i class="fas fa-edit  mr-2 block mx-auto"></i>Edit</button>
                <button class="delete-btn text-xs">
                    <i class="fas fa-trash-alt mr-2 block mx-auto"></i>Delete</button>
            </div>
        </div>
    </div>
`;

    // Add event listeners to edit and delete buttons
    const editBtn = productCard.querySelector(".edit-btn");
    const deleteBtn = productCard.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => showEditPopup(index));
    deleteBtn.addEventListener("click", () => showDeleteConfirmation(index));

    productContainer.appendChild(productCard);
    getImageColor(product.imgUrl, productCard);
  });
}

function getImageColor(imgUrl, cardElement) {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];

    // Create a subtle shade using the dominant color
    cardElement.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
  };

  img.src = imgUrl;
}

function save() {
  localStorage.setItem("products", JSON.stringify(products));
}
