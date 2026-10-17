const people = [
  {
    name: "Maya Chen",
    details: "Illustrator · Brooklyn",
    teach: "Watercolor painting",
    learn: "Basic guitar",
    category: "Creative",
    online: true,
    avatar: "👩🏻‍🎨"
  },
  {
    name: "Jordan Ellis",
    details: "Frontend developer · Austin",
    teach: "JavaScript basics",
    learn: "Portrait photography",
    category: "Tech",
    online: true,
    avatar: "👨🏽‍💻"
  },
  {
    name: "Aisha Patel",
    details: "Home cook · Queens",
    teach: "Gujarati cooking",
    learn: "Houseplant care",
    category: "Lifestyle",
    online: false,
    avatar: "👩🏽‍🍳"
  },
  {
    name: "Theo Martin",
    details: "Musician · Portland",
    teach: "Guitar for beginners",
    learn: "Screen printing",
    category: "Creative",
    online: true,
    avatar: "🧑🏻‍🎸"
  },
  {
    name: "Nia Williams",
    details: "UX designer · Chicago",
    teach: "Figma and prototyping",
    learn: "Sourdough baking",
    category: "Tech",
    online: true,
    avatar: "👩🏾‍💻"
  },
  {
    name: "Sam Rivera",
    details: "Garden lover · Denver",
    teach: "Balcony gardening",
    learn: "Conversational Spanish",
    category: "Lifestyle",
    online: false,
    avatar: "🧑🏽‍🌿"
  }
];

const grid = document.querySelector("#people-grid");
const searchInput = document.querySelector("#search-input");
const onlineOnly = document.querySelector("#online-only");
const resultCount = document.querySelector("#result-count");
const emptyMessage = document.querySelector("#empty-message");
const filters = document.querySelectorAll(".filter");

let activeCategory = "All";

function showPeople() {
  const searchText = searchInput.value.toLowerCase().trim();

  const matchingPeople = people.filter(person => {
    const searchableText = [
      person.name,
      person.details,
      person.teach,
      person.learn,
      person.category
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchText);
    const matchesCategory =
      activeCategory === "All" || person.category === activeCategory;
    const matchesOnline = !onlineOnly.checked || person.online;

    return matchesSearch && matchesCategory && matchesOnline;
  });

  grid.innerHTML = matchingPeople.map(person => `
    <article class="person-card">
      <div class="person-top">
        <div class="avatar" aria-hidden="true">${person.avatar}</div>

        <div>
          <h3 class="person-name">${person.name}</h3>
          <p class="person-meta">
            ${person.online ? "● Online · " : ""}
            ${person.details}
          </p>
        </div>

        <button
          class="save-button"
          type="button"
          aria-label="Save ${person.name}"
          aria-pressed="false">♡</button>
      </div>

      <div class="skills">
        <div>
          <span class="skill-label">I can teach</span>
          <p class="skill-value">${person.teach}</p>
        </div>

        <div>
          <span class="skill-label">I want to learn</span>
          <p class="skill-value">${person.learn}</p>
        </div>
      </div>

      <div class="card-bottom">
        <span class="tag">${person.category}</span>
        <button
          class="connect-button"
          type="button"
          data-person="${person.name}">Say hello ↗</button>
      </div>
    </article>
  `).join("");

  resultCount.textContent = matchingPeople.length;
  emptyMessage.hidden = matchingPeople.length > 0;
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", selected);
    });

    showPeople();
  });
});

searchInput.addEventListener("input", showPeople);
onlineOnly.addEventListener("change", showPeople);

grid.addEventListener("click", event => {
  const saveButton = event.target.closest(".save-button");

  if (saveButton) {
    const isSaved = saveButton.getAttribute("aria-pressed") !== "true";
    saveButton.setAttribute("aria-pressed", isSaved);
    saveButton.textContent = isSaved ? "♥" : "♡";
    return;
  }

  const connectButton = event.target.closest(".connect-button");

  if (connectButton) {
    const person = people.find(
      item => item.name === connectButton.dataset.person
    );

    document.querySelector("#match-name").textContent = person.name;
    document.querySelector("#match-skills").textContent =
      `They can teach ${person.teach} and want to learn ${person.learn}.`;

    document.querySelector("#connect-message").textContent = "";
    document.querySelector("#connect-dialog").showModal();
  }
});

document.querySelector("#close-dialog").addEventListener("click", () => {
  document.querySelector("#connect-dialog").close();
});

document.querySelector("#connect-form").addEventListener("submit", event => {
  event.preventDefault();

  document.querySelector("#connect-message").textContent =
    "Demo message ready! Real messaging is not connected.";

  event.currentTarget.reset();
});

document.querySelector("#share-form").addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  people.unshift({
    name: formData.get("name"),
    details: "New to SkillSwap",
    teach: formData.get("teach"),
    learn: formData.get("learn"),
    category: formData.get("category"),
    online: formData.has("online"),
    avatar: "🙌"
  });

  searchInput.value = "";
  onlineOnly.checked = false;
  activeCategory = "All";

  filters.forEach(filter => {
    const selected = filter.dataset.category === "All";
    filter.classList.toggle("active", selected);
    filter.setAttribute("aria-pressed", selected);
  });

  showPeople();
  event.currentTarget.reset();

  document.querySelector("#share-message").textContent =
    "Your demo listing has been added to the top of the list.";

  document.querySelector("#browse").scrollIntoView({
    behavior: "smooth"
  });
});

const menuButton = document.querySelector("#menu-button");
const mainNav = document.querySelector("#main-nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") !== "true";

  menuButton.setAttribute("aria-expanded", isOpen);
  mainNav.classList.toggle("open", isOpen);
});

mainNav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  }
});

showPeople();