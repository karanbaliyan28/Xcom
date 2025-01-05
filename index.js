let loginBtn = document.querySelector("#loginBtn");
let signupBtn = document.querySelector("#signupBtn");
let loginForm = document.querySelector("#login");
let signupForm = document.querySelector("#signup");
let message = document.querySelector("#successMessage");
const ADMIN_SECRET_CODE = "ADMIN@ecom1234";

function toggleForms() {
  loginBtn.addEventListener("click", () => {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  });
  signupBtn.addEventListener("click", () => {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
  });
  loginForm.classList.add("active");
}
toggleForms();

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  document.querySelectorAll(".alert").forEach((element) => {
    element.innerHTML = "";
  });

  let username = document.querySelector("#username").value.trim();
  let email = document.querySelector("#email").value.trim();
  let password = document.querySelector("#password").value;
  let cnfpassword = document.querySelector("#cnfpassword").value;
  let adminCode = document.querySelector("#adminCode").value.trim();

  let isValid = true;

  if (username.length < 3) {
    document.querySelector("#usernameAlert").innerHTML =
      "Username must be at least 3 characters long";
    isValid = false;
  }
  if (password.length < 6) {
    document.querySelector("#passwordAlert").innerHTML =
      "Password must be at least 6 characters long";
    isValid = false;
  }
  if (password != cnfpassword) {
    document.querySelector("#cnfPasswordAlert").innerHTML =
      "Passwords do not match";
    isValid = false;
  }

  let userRole = "user";
  if (adminCode) {
    if (adminCode !== ADMIN_SECRET_CODE) {
      document.querySelector("#adminCodeAlert").innerHTML =
        "Enter valid admin registration code ...";
      isValid = false;
    } else {
      userRole = "admin";
    }
  }

  if (isValid) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((user) => user.username === username)) {
      document.querySelector("#usernameAlert").innerHTML =
        "This username already exists";
      return;
    }
    if (users.some((user) => user.email === email)) {
      document.querySelector("#emailAlert").innerHTML =
        "This email already exists";
      return;
    }

    if (userRole === "admin") {
      users.push({
        username,
        email,
        password,
        role: userRole,
        id: Date.now(),
      });
    } else {
      users.push({
        username,
        email,
        password,
        role: userRole,
        id: Date.now(),
        cart: [],
      });
    }
    localStorage.setItem("users", JSON.stringify(users));
    signupForm.reset();
    message.textContent = `Hey ${username}, thank you for signing up. Your role is: ${userRole}. Please login.`;
    setTimeout(() => {
      loginBtn.click();
    }, 1000);
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  document.querySelectorAll(".alert").forEach((element) => {
    element.innerHTML = "";
  });

  let email = document.querySelector("#loginEmail").value.trim();
  let password = document.querySelector("#loginPassword").value;
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  //user search kar liya email ki madad se  ......
  let user = users.find((u) => u.email === email);

  if (user) {
      if (password === user.password) {
        // Store kar liya current user ko jisse uski profile pe navigate kara sake .
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (user.role === "admin") {
          message.textContent = `Welcome Admin ${user.username}, redirecting...`;
          setTimeout(() => {
            window.location.href = "admin.html";
          }, 1500);
        } else {
          message.textContent = `Welcome ${user.username}, redirecting...`;
          setTimeout(() => {
            window.location.href = "profile.html";
          }, 1500);
        }
        loginForm.reset();
      }
     else {
      document.getElementById("loginPasswordAlert").textContent =
        "Incorrect password";
    }
  } else {
    document.getElementById("loginEmailAlert").textContent =
      "Email not registered";
  }
});
