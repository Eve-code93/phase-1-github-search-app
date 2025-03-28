document.getElementById("search-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const query = document.getElementById("search-input").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Loading...";
    
    let url = searchType === "user" 
        ? `https://api.github.com/search/users?q=${query}`
        : `https://api.github.com/search/repositories?q=${query}`;
    
    try {
        const response = await fetch(url, { headers: { "Accept": "application/vnd.github.v3+json" } });
        const data = await response.json();
        resultsDiv.innerHTML = "";

        if (searchType === "user") {
            data.items.forEach(user => {
                const userDiv = document.createElement("div");
                userDiv.classList.add("user");
                userDiv.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.login}">
                    <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
                `;
                userDiv.addEventListener("click", () => fetchRepos(user.login));
                resultsDiv.appendChild(userDiv);
            });
        } else {
            data.items.forEach(repo => {
                const repoDiv = document.createElement("div");
                repoDiv.classList.add("repo");
                repoDiv.innerHTML = `
                    <p><a href="${repo.html_url}" target="_blank">${repo.full_name}</a></p>
                `;
                resultsDiv.appendChild(repoDiv);
            });
        }
    } catch (error) {
        resultsDiv.innerHTML = "Error fetching data. Please try again later.";
    }
});

async function fetchRepos(username) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Loading repositories...";
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        });
        const repos = await response.json();
        resultsDiv.innerHTML = "<h2>Repositories</h2>";
        repos.forEach(repo => {
            const repoDiv = document.createElement("div");
            repoDiv.classList.add("repo");
            repoDiv.innerHTML = `<p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>`;
            resultsDiv.appendChild(repoDiv);
        });
    } catch (error) {
        resultsDiv.innerHTML = "Error fetching repositories.";
    }