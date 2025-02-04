const factList = document.getElementById("factList");
const factForm = document.getElementById("submit-form");
const factInput = document.getElementById("fact-input");
const categoryInput = document.getElementById("fact-category");

const API_URL = ""; // Update with correct URL

// Fetch and display facts
async function fetchFacts(category = "all") {
  try {
    const res = await fetch(`${API_URL}?category=${category}`);
    const facts = await res.json();
    factList.innerHTML = ""; // Clear the current list

    facts.forEach((fact) => {
      const li = document.createElement("li");
      li.innerHTML = `<p class="fact-text">${fact.text}</p>
      <p class="fact-category">Category: ${fact.category}</p>`;

      factList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching facts:", error);
  }
}

// Handle form submission for adding a new fact
factForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = factInput.value;
  const category = categoryInput.value;

  try {
    const response = await fetch(API_URL, {
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

// Fetch all facts when the page loads
fetchFacts();
