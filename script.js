document.addEventListener("DOMContentLoaded", function () {
    const indexDiv = document.querySelector(".index");
    const loginContainer = document.querySelector(".login-container");
    const createAccountContainer = document.querySelector(".create-account-container");
    const createAccountForm = document.querySelector("#createAccountForm");
    const loginForm = document.querySelector("#loginForm");

    // Regular expressions for email and password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    // Function to load user records from localStorage
    function loadUserRecords() {
        return JSON.parse(localStorage.getItem("userRecords")) || [];
    }

    // Function to save user records to localStorage
    function saveUserRecords(records) {
        localStorage.setItem("userRecords", JSON.stringify(records));
    }

    let records = loadUserRecords(); // When the page loads, load the user records from localStorage

    // Function to reset the input fields
    function resetFormFields(form) {
        form.reset();
    }

    // Function to show a message below the authorization container
    function showMessage(message, success = true) {
        const authorizationDiv = document.querySelector(".authorization");
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.className = `text-center mt-3 ${success ? "text-success" : "text-danger"}`;
        authorizationDiv.appendChild(messageDiv);

        // Timeout to remove the message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Function to handle user registration
    function handleRegistration(event) {
        event.preventDefault();
        const { fullName, email, createPassword, confirmPassword } = createAccountForm.elements;

        // Validate inputs
        if (!fullName.value.trim() || !email.value.trim() || !createPassword.value || !confirmPassword.value) {
            showMessage("Please fill in all the fields.", false);
            return;
        }

        if (!emailRegex.test(email.value.toLowerCase().trim())) {
            showMessage("Please enter a valid email address.", false);
            return;
        }

        if (!passwordRegex.test(createPassword.value)) {
            showMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.", false);
            return;
        }

        if (createPassword.value !== confirmPassword.value) {
            showMessage("Passwords do not match.", false);
            return;
        }

        // Check if the email is already registered
        if (records.some((user) => user.email === email.value.toLowerCase().trim())) {
            showMessage("This email is already registered.", false);
            return;
        }

        // Registration successful, add the user to the records
        records.push({ fullName: fullName.value.trim(), email: email.value.toLowerCase().trim(), password: createPassword.value, isLoggedIn: false, threads: [] });
        saveUserRecords(records); // Save records to localStorage
        showMessage("Registration successful! You can now log in.", true);

        // Reset the form fields and switch to login form
        resetFormFields(createAccountForm);
        createAccountContainer.classList.add("d-none");
        loginContainer.classList.remove("d-none");
    }

    // Function to handle user login
    function handleLogin(event) {
        event.preventDefault();
        const { userId, password } = loginForm.elements;

        // Validate email input
        if (!emailRegex.test(userId.value.toLowerCase().trim())) {
            showMessage("Please enter a valid email address.", false);
            return;
        }

        // Find the user with the matching userId (email) in the records
        const user = records.find((user) => user.email === userId.value.toLowerCase().trim());

        if (!user) {
            // User not found, show an error message
            showMessage("Email not registered.", false);
            return;
        }

        // Check if the entered password matches the user's password
        if (user.password !== password.value) {
            // Incorrect password, show an error message
            showMessage("Incorrect password.", false);
            return;
        }

        // Login successful, update isLoggedIn status, show a message and redirect to chatgpt.html
        user.isLoggedIn = true;
        saveUserRecords(records); // Save updated records to localStorage
        showMessage("Login successful!!");
        setTimeout(() => {
            resetFormFields(loginForm);
            window.location.href = "interface/chatgpt.html";
        }, 1500);
    }

    // Check if any user is already logged in on page load
    const loggedInUser = loadUserRecords().find((user) => user.isLoggedIn);
    if (loggedInUser) {
        showMessage("Welcome back! Redirecting to chatgpt.html...");
        setTimeout(() => {
            window.location.href = "interface/chatgpt.html";
        }, 2000);
    }

    // Attach the registration and login event handlers using event delegation
    createAccountForm.addEventListener("submit", handleRegistration);
    loginForm.addEventListener("submit", handleLogin);

    document.querySelector(".login-btn").addEventListener("click", () => {
        indexDiv.classList.add("d-none");
        loginContainer.classList.remove("d-none");
    });

    document.querySelector(".register-btn").addEventListener("click", () => {
        indexDiv.classList.add("d-none");
        createAccountContainer.classList.remove("d-none");
    });

    createAccountLink.addEventListener("click", (event) => {
        event.preventDefault();
        resetFormFields(createAccountForm); // Reset create account form fields
        createAccountContainer.classList.remove("d-none");
        loginContainer.classList.add("d-none");
    });

    loginInsteadLink.addEventListener("click", (event) => {
        event.preventDefault();
        resetFormFields(loginForm); // Reset login form fields
        createAccountContainer.classList.add("d-none");
        loginContainer.classList.remove("d-none");
    });
});
