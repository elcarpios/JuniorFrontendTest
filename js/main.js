initializeWeb();

function initializeWeb() {
	eventSearchButton();
}

function eventSearchButton() {
	let button = document.getElementById('searchButton');
	let input = document.getElementById('inputUserName');
	
	button.addEventListener('click', function () {
		makeSearch('https://api.github.com/users/' + input.value, 'user');
	});
	input.addEventListener('keyup', function (e) {
		let key = e.which || e.keyCode;
		if (key === 13) {
			makeSearch('https://api.github.com/users/' + input.value, 'user');
		}
	});
}

function makeSearch(url, section) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 &&
			xmlhttp.status == 200) {
			let data = JSON.parse(xmlhttp.responseText);
			switch (section) {
				case 'user':
					builtGitInfo(data);
					break;
				case 'repos':
					builtGitRepos(data);
					break;

				default:
					alert('Info pointer null!');
					break;
			}
		} else if (xmlhttp.readyState == 4 &&
			xmlhttp.status == 404) {
			builtNotFound();
		}
	};
	xmlhttp.send(null);
}

function builtNotFound() {

	// Get Search Box Container 
	let searchContainer = document.getElementById('searchContainer');

	// Check if we have some old search or not found result
	deleteOldResults();

	// Create info-card
	let infoCard = createDiv('notFoundInfo', 'info-card', 'Does not exist');

	searchContainer.appendChild(infoCard);
}

function builtGitInfo(data) {

	// Get Search Box Container 
	let searchContainer = document.getElementById('searchContainer');

	// Check if we have some old search or not found result
	deleteOldResults();

	// Create container to store user and repos info and clean if has some old info
	let searchInfo = createDiv('searchInfo', 'search-info', '');
	searchInfo.innerHTML = ' ';

	// Create user-card for info
	let userCard = createDiv('userCard', 'user-card', '');

	// Avatar
	let avatar = createDiv('avatar', '', '');
	let avatarImg = document.createElement('img');
	avatarImg.src = data.avatar_url;
	avatarImg.className = 'avatar-img';

	// Append Items
	searchContainer.appendChild(searchInfo);
	searchInfo.appendChild(userCard);
	userCard.appendChild(avatar);
	avatar.appendChild(avatarImg);


	// User info
	let infoContainer = createDiv('userInfo', 'user-info', '');
	let userName = createDiv('userName', 'user-field', isEmpty(data.login));
	let fullName = createDiv('fullName', 'user-field', isEmpty(data.name));
	let bio = createDiv('bio', 'user-field', isEmpty(data.bio));

	userCard.appendChild(infoContainer);
	infoContainer.appendChild(userName);
	infoContainer.appendChild(fullName);
	infoContainer.appendChild(bio);

	// User repos
	let input = document.getElementById('inputUserName');
	makeSearch('https://api.github.com/users/' + input.value + '/repos', 'repos');
}

function builtGitRepos(repos) {

	// Get the parent
	let parent = document.getElementById('searchInfo');

	let userRepos = createDiv('userRepos', 'user-repositories', '');
	let title = createDiv('', 'title-repositories', 'Repositories');
	let titleSeparator = createDiv('', 'title-separator', '');

	parent.appendChild(userRepos);
	userRepos.appendChild(title);
	userRepos.appendChild(titleSeparator);

	for (let i = 0; i < repos.length; i++) {

		// Repo container
		let repo = createDiv('', 'repo-item', '');
		let repoName = createDiv('', '', repos[i].name);
		let repoDetailsinnerHTML = '<svg aria-hidden="true" class="octicon octicon-star" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"></path></svg> ' + 
		+ repos[i].stargazers_count + 
		' <svg aria-hidden="true" class="octicon octicon-repo-forked" height="16" version="1.1" viewBox="0 0 10 16" width="10"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg> ' +
		+ repos[i].forks_count;
		let repoDetails = createDiv('', '',repoDetailsinnerHTML);
		let repoSeparator = createDiv('', 'repo-separator', '');

		repo.appendChild(repoName);
		repo.appendChild(repoDetails);
		userRepos.appendChild(repo);
		userRepos.appendChild(repoSeparator);
	}
	
	// Once all is charged, we show the info-div 
	let searchInfo = document.getElementById('searchInfo');
	searchInfo.style.visibility = 'visible';
}

function createDiv(id, classes, innerhtml) {
	let div = document.createElement('div');
	div.id = id;
	div.className = classes;
	div.innerHTML = innerhtml;
	return div;
}

function deleteOldResults() {
	if (document.getElementById('notFoundInfo')) {
		document.getElementById('notFoundInfo').remove();
	}
	if (document.getElementById('searchInfo')) {
		document.getElementById('searchInfo').remove();
	}
}

function isEmpty(data) {
	if (data == null) {
		data = '';
	}
	return data;
}
