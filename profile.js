//USER CHECK
// --- > Ye check karega koi user ya admin login hai ya nahi .
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  // For admin.html
  if (window.location.pathname.includes("admin.html")) {
    if (currentUser.role !== "admin") {
      window.location.href = "profile.html";
    }
  }

  // For profile.html
  if (window.location.pathname.includes("profile.html")) {
    if (currentUser.role === "admin") {
      window.location.href = "admin.html";
    }
  }
  return currentUser;
}

//curent user ko store karaya
const currentUser = checkAuth();
//Har Reload pe display kar denge products
document.addEventListener("DOMContentLoaded", () => {
  displayUserProfile();
});
displayUserProfile();
//LOGOUT BUTTON

//----> logout pe click karte hi currentuser localstorage se delete kar diya aur fir window ko loginPage pe bhej diya .
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

function displayUserProfile() {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  let totalBill = 0;

  document.getElementById("username").textContent = currentUser.username;
  renderProducts(products);

  const cartContainer = document.getElementById("cartContainer");
  cartContainer.innerHTML = "";

  if (currentUser.cart && currentUser.cart.length > 0) {
    currentUser.cart.forEach((cartItem) => {
      const prod = products.find((p) => p.id === cartItem.productId);
      if (prod) {
        totalBill += prod.price * cartItem.quantity;
        cartContainer.innerHTML += `
            <div class="flex gap-2 items-center bg-gray-300 p-2 rounded-lg">
                <div class="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden">
                    <img class="w-full h-full object-cover" src="${prod.imgUrl}"/>
                </div>
                <div>
                    <h3 class="font-semibold">${prod.name}</h3>
                    <h5 class="text-sm font-semibold opacity-80">₹${prod.price}</h5>
                </div>
                <div class="flex items-center gap-2 ml-4">
                    <button onclick="updateCartQuantity(${prod.id}, -1)" 
                            class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">-</button>
                    <span class="font-semibold">${cartItem.quantity}</span>
                    <button onclick="updateCartQuantity(${prod.id}, 1)"
                            class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">+</button>
                </div>
            </div>
        `;
      }
    });
    document.getElementById("total").textContent = `Total: ₹${totalBill}`;
  } else {
    cartContainer.innerHTML = '<p class="text-white">Your cart is empty</p>';
    document.getElementById("total").textContent = "Total: ₹0";
  }
}

//Toggle cart

function toggleCart() {
  document.getElementById("cartBtn").addEventListener("click", () => {
    let cartBox = document.getElementById("cartBox");
    if (cartBox.classList.contains("hidden")) {
      cartBox.classList.remove("hidden");
      cartBtn.style.transform = "rotate(+25deg)";
    } else {
      cartBox.classList.add("hidden");
      cartBtn.style.transform = "rotate(0deg)";
    }
  });
}

toggleCart();

//PRODUCTS RENDERING

//---> sare poducts dikhaye isse
function renderProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const isOutOfStock = product.availability <= 0;
    const isDisable = false;
    const productCard = document.createElement("div");
    productCard.classList.add(
      "shadow-xl",
      "rounded-lg",
      "border",
      "border-[#327825]",
      "w-[80%]",
      "block",
      "mx-auto",
      "mt-3"
    );
    productCard.innerHTML = `
        <div class="w-[100%] h-[100%] p-4 relative">
        ${
          isOutOfStock
            ? `
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span class="text-white font-bold text-lg">Out of Stock</span>
            </div>
        `
            : ""
        }
        <img class="h-[45%] w-full object-cover rounded-lg my-auto mx-auto block ${
          isOutOfStock ? "opacity-50" : ""
        }" 
             src="${product.imgUrl}" alt="Product Image">
        <div class="col-span-2 p-2">
            <h2 class="text-lg font-bold text-orange-400">${product.name}</h2>
            <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p class="text-md"><strong>Category:</strong> ${
                  product.category
                }</p>
                <p class="text-md"><strong>Price:</strong> ₹${product.price}</p>
                <p class="text-md"><strong>Stock:</strong> ${
                  product.availability
                }</p>
            </div>
            <div class="btns flex justify-end gap-4 mt-2">
                <button onclick="addToCart(${product.id})" 
                        class="cursor-pointer hover:bg-gray-800 px-2 py-1 rounded-md bg-gray-600 text-white"
                        ${
                          isOutOfStock
                            ? 'disabled style="opacity: 0.5; cursor: not-allowed;"'
                            : ""
                        }>
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    </div>
`;
    productContainer.appendChild(productCard);
    getImageColor(product.imgUrl, productCard);
  });
}

//ADD TO CART

function addToCart(productId) {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const users = JSON.parse(localStorage.getItem("users"));

  let currentProduct = products.find((prod) => prod.id === productId);
  if (currentProduct.availability > 0) {
    currentProduct.availability--;
  }
  // Initialize kara cart if it doesn't exist
  if (!currentUser.cart || !Array.isArray(currentUser.cart)) {
    currentUser.cart = [];
  }

  // Check if product is already in cart
  const existingItem = currentUser.cart.find(
    (item) => typeof item === "object" && item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    currentUser.cart.push({ productId:productId, quantity: 1 });
  }

  // Update current user and product with current availability in localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update user in users array
  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? { ...user, cart: currentUser.cart } : user
  );
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("products", JSON.stringify(products));
  // Refresh the cart display
  displayUserProfile();

  document.getElementById(
    "addMessage"
  ).textContent = `${currentProduct.name} Added to cart ..`;

  // Clear the message after 1.5 seconds
  setTimeout(() => {
    document.getElementById("addMessage").textContent = "";
  }, 1500);
}

//UPDATE KAREGA CART ITEM KI QUANTITY
function updateCartQuantity(productId, change) {
  const users = JSON.parse(localStorage.getItem("users"));
  const products = JSON.parse(localStorage.getItem("products"));

  const cartItem = currentUser.cart.find(
    (item) => item.productId === productId
  );
  const product = products.find((prod) => prod.id === productId);

  if (cartItem && product) {
    // Decreasing quantity
    if (change < 0) {
      cartItem.quantity += change;
      product.availability -= change; // Increase availability when reducing quantity
    }
    // Increasing quantity
    else if (change > 0 && product.availability > 0) {
      cartItem.quantity += change;
      product.availability -= change;
    }

    // Remove item if quantity becomes 0
    if (cartItem.quantity <= 0) {
      currentUser.cart = currentUser.cart.filter(
        (item) => item.productId !== productId
      );
    }

    // Update storage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("products", JSON.stringify(products));

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? { ...user, cart: currentUser.cart } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Refresh display
    displayUserProfile();
  }
}

//KISI CART ITEM KO REMOVE KARNE KE LIYE CART SE

//LOCAL STORAGE ME PRODUCTS ARRAY SAVE KARNE KE LIYE
function save() {
  localStorage.setItem("products", JSON.stringify(products));
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users"));

  if (currentUser.cart && currentUser.cart.length > 0) {
    alert("Order placed successfully! Thank you for shopping with us.");
    currentUser.cart = [];

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((user) =>
          user.id === currentUser.id ? { ...user, cart: [] } : user
        )
      )
    );

    displayUserProfile();
    document.getElementById("cartBox").classList.add("hidden");
    document.getElementById("cartBtn").style.transform = "rotate(0deg)";
  }
});

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
