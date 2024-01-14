document.addEventListener("DOMContentLoaded", function () {
  // Function to load user records from localStorage
  function loadUserRecords() {
    return JSON.parse(localStorage.getItem("userRecords")) || [];
  }

  // Find the logged-in user's record
  const userRecords = loadUserRecords();
  const loggedInUser = userRecords.find((user) => user.isLoggedIn);

  if (!loggedInUser) {
    window.location.href = "../index.html";
    return;
  }

  // Display logged-in user's email
  const emailDiv = document.querySelector('.email');
  emailDiv.textContent = loggedInUser.email;

  // Get references to the elements
  const sidebar = document.querySelector('.sidebar');
  const collapseBtnSidebar = document.getElementById('collapseBtnSidebar');
  const collapseBtnMainContent = document.getElementById('collapseBtnMainContent');
  const userMenu = document.querySelector('.user-menu');
  const userInfoBtn = document.getElementById('userInfoBtn');
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.getElementById('searchButton');
  const threadDiv = document.querySelector('.thread');
  const container = document.querySelector('.container');
  const logoutBtn = document.getElementById('logoutBtn');
  const newChatBtn = document.getElementById('newChatBtn');
  let thread = [];

  // Function to toggle sidebar visibility
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    collapseBtnMainContent.classList.toggle('d-none');
  }

  // Function to toggle user option menu visibility
  function toggleUserMenu() {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  }

  // Close user menu if clicked outside
  window.addEventListener('click', function (event) {
    if (!userInfoBtn.contains(event.target) && !userMenu.contains(event.target)) {
      userMenu.style.display = 'none';
    }
  });

  // Function to handle media query changes
  function handleMediaQueryChange(mediaQuery) {
    if (mediaQuery.matches) {
      toggleSidebar();
      collapseBtnMainContent.classList.remove('d-none');
    } else {
      sidebar.classList.remove('collapsed');
      collapseBtnMainContent.classList.add('d-none');
    }
  }

  // Add click event listeners
  collapseBtnSidebar.addEventListener('click', toggleSidebar);
  collapseBtnMainContent.addEventListener('click', toggleSidebar);
  userInfoBtn.addEventListener('click', toggleUserMenu);

  // Add a media query listener to automatically toggle sidebar when viewport width changes
  const mediaQuery = window.matchMedia('(max-width: 1200px)');
  mediaQuery.addEventListener('change', handleMediaQueryChange);
  handleMediaQueryChange(mediaQuery);

  // Disable search button if search input is empty
  searchInput.addEventListener('input', function () {
    searchButton.disabled = searchInput.value.trim() === '';
  });

  // Function to handle search form submission
  function handleSearchSubmit(event) {
    event.preventDefault(); // Prevent form submission

    // Get the input from the search bar
    const searchText = searchInput.value.trim();
    searchInput.value = '';
    container.classList.add('d-none');

    // Create a new div and set its content
    const newDiv = document.createElement('div');
    const queryIndex = thread.length; // Get the current index of the query
    const isOddIndex = queryIndex % 2 === 1; // Check if the index is odd

    // Add the bg-light class if the index is odd
    const queriesClass = isOddIndex ? 'queries border-bottom mx-auto bg-light' : 'queries border-bottom mx-auto';

    newDiv.innerHTML = `<div class="${queriesClass}">
    <div class="query py-2">${loggedInUser.fullName}: ${searchText}</div>
      <div class="response py-2">
        ChatGPT: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
        deserunt mollit anim id est laborum.
      </div>
      </div`;

    thread.push(newDiv.innerHTML);
    threadDiv.appendChild(newDiv);

    // Update user records in local storage
    loggedInUser.thread = thread;
    localStorage.setItem("userRecords", JSON.stringify(userRecords));
  }

  // Add submit event listener to the search form
  searchButton.addEventListener('click', handleSearchSubmit);

  // Function to handle log out
  function handleLogout() {
    loggedInUser.isLoggedIn = false;
    localStorage.setItem("userRecords", JSON.stringify(userRecords));
    window.location.href = "../index.html";
  }

  // Add click event listener to the log out button
  logoutBtn.addEventListener('click', handleLogout);

  // Function to handle button click
  function handleButtonClick(event) {
    if (event.target.tagName === 'BUTTON') {
      const buttonContent = event.target.textContent;
      searchInput.value = buttonContent;
      searchButton.disabled = false;

      handleSearchSubmit(event);
    }
  }

  // Add click event listener to buttons inside the container
  container.addEventListener('click', handleButtonClick);

  // Function to handle new chat button click
  function handleNewChat() {
    if (threadDiv.innerHTML.trim() !== '' && thread !== '') {
      threadDiv.innerHTML = '';
      container.classList.toggle('d-none');
      loggedInUser.threads.push(thread);
      localStorage.setItem("userRecords", JSON.stringify(userRecords));
      thread = [];
      updateThreadNames();
    }
  }

  // Add click event listener to the new chat button
  newChatBtn.addEventListener('click', handleNewChat);
  newChatBtn.addEventListener('click', updateThreadNames);

  const sidebarThreadNames = document.querySelector('.sidebar-thread-names');

  // Function to update thread names in the sidebar
  function updateThreadNames() {
    sidebarThreadNames.innerHTML = '';

    if (loggedInUser.threads.length > 0) {
      loggedInUser.threads.forEach((thread, index) => {
        const threadNameButton = document.createElement('div');
        threadNameButton.classList.add('btn', 'btn-dark', 'w-100', 'border-secondary', 'mb-2', 'thread-name');
        threadNameButton.textContent = `Thread ${index + 1}`;
        threadNameButton.dataset.threadIndex = index;
        threadNameButton.addEventListener('click', () => loadThread(index));
        sidebarThreadNames.appendChild(threadNameButton);
      });
    }
  }

  // Function to load and display a specific thread
  function loadThread(threadIndex) {
    thread = loggedInUser.thread
    container.classList.add('d-none');
    threadDiv.innerHTML = loggedInUser.threads[threadIndex].join('');
  }

  // Call the updateThreadNames function initially to populate thread names
  updateThreadNames();
});
