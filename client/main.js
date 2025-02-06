const factList = document.getElementById("factList");
const factForm = document.getElementById("submit-form");
const factInput = document.getElementById("fact-input");
const categoryInput = document.getElementById("fact-category");
const categoryFilter = document.getElementById("category");
const favouritesList = document.getElementById("favorites-list");
const factText = document.getElementById('fact-text')
const API_URL = "https://api.api-ninjas.com/v1/facts"; 

//load favs from local storage
let favourites = loadFavourites();

// Fetch and display facts
async function fetchFacts(category = "all") {
  const fetchURL = category === "all" ? API_URL : `${API_URL}?category=${category}`
  try {
    const res = await fetch(fetchURL, {headers: {'X-Api-Key': ''}});
    const fact= await res.json();


    factText.innerText = fact[0].fact
    // factList.innerHTML = ""; // Clear the current list

    // facts.forEach((fact) => {
    //   const factItem = document.createElement("div");
    //   factItem.classList.add("fact-item");
    //   factItem.innerHTML = `
    //     <p class="fact-text">${fact.text}</p>
    //     <p class="fact-category">Category: ${fact.category}</p>
    //     <button class="like-btn" data-id="${fact.id}">❤️ Like</button>
    //   `;

    //   factList.appendChild(factItem);

      // // Add event listener to the "Like" button
      // factItem
      //   .querySelector(".like-btn")
      //   .addEventListener("click", () => addToFavourites(fact));
    // });
  } catch (error) {
    console.error("Error fetching facts:", error);
  }
}


function fetchUserSubmitedFacts() {
  // fetch from DATABASE instead of from 3rdParty API
  // make a seperate section in the landing page for 'user submited facts'
  // your POST/SUBMIT FORM will post to your database. 
  // DONT 'take' the data from the third party api. 

}
// Handle form submission for adding a new fact
factForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = factInput.value;
  const category = categoryInput.value;

  try {
    const response = await fetch('http://localhost:3000/api/facts', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, category }),
    });

    if (response.ok) {
      factInput.value = ""; // Clear the input fields
      fetchFacts(); // Refresh the facts list
    }
  } catch (error) {
    console.error("Error adding fact:", error);
  }
});

// Filter facts by category
categoryFilter.addEventListener("change", (event) => {
  const selectedCategory = event.target.value;
  fetchFacts(selectedCategory);
});

//dave fact to local stoarage
function addToFavourites(fact) {
  if (!favourites.some((fav) => fav.id === fact.id)) {
    favourites.push(fact);
    saveFavourites();
    showFavourites();
  }
}

//show teh favourites
function showFavourites() {
  favouritesList.innerHTML = "";

  favourites.forEach((fact) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p class="fact-text">${fact.text}</p>
      <p class="fact-category">Category: ${fact.category}</p>
    `;
    favouritesList.appendChild(li);
  });
}

function saveFavourites() {
  localStorage.setItem("favourites", JSON.stringify(favourites));
}

function loadFavourites() {
  const savedFavourites = localStorage.getItem("favourites");
  return savedFavourites ? JSON.parse(savedFavourites) : [];
}

// Fetch all facts when the page loads
fetchFacts();

//SHow favs on page load
showFavourites();
