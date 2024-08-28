let currentTitle = ''; // Variable to store the current page title

// Listen for title updates from the main process
window.electronAPI.on('update-title', (event, title) => {
    currentTitle = title;
});

function navigateToURL(url) {
    const specialURLs = ['about:blank', 'about:newtab'];

    if (!specialURLs.includes(url) && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = `http://${url}`;
    }

    window.electronAPI.send('navigate', url);
}

document.getElementById('go-btn').addEventListener('click', () => {
    const url = document.getElementById('url').value;
    navigateToURL(url);
});

document.getElementById('url').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const url = e.target.value;
        navigateToURL(url);
    }
});

document.getElementById('back-btn').addEventListener('click', () => {
    window.electronAPI.send('goBack');
});

document.getElementById('forward-btn').addEventListener('click', () => {
    window.electronAPI.send('goForward');
});

document.getElementById('reload-btn').addEventListener('click', () => {
    window.electronAPI.send('reload');
});

document.getElementById('open-external-btn').addEventListener('click', () => {
    const url = document.getElementById('url').value;
    window.electronAPI.send('open-external', url);
});

document.getElementById('bookmark-btn').addEventListener('click', () => {
    const url = document.getElementById('url').value;
    addBookmark(currentTitle || 'Untitled', url); // Use the current title for the bookmark
});

function addBookmark(title, url) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push({ title, url });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks();
}

function deleteBookmark(index) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.splice(index, 1); // Remove the bookmark at the given index
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks(); // Refresh the bookmark list
}

function displayBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmarkList = document.getElementById('bookmark-list');
    bookmarkList.innerHTML = '';

    bookmarks.forEach((bookmark, index) => {
        const li = document.createElement('li');
        li.textContent = bookmark.title || bookmark.url;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '8px';
        deleteBtn.style.backgroundColor = '#ff4444';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '3px';
        deleteBtn.style.color = 'white';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '11px';

        // Prevent the event from propagating to the parent li element
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop the event from bubbling up
            deleteBookmark(index);
        });

        li.addEventListener('click', () => {
            navigateToURL(bookmark.url);
        });

        li.appendChild(deleteBtn);
        bookmarkList.appendChild(li);
    });
}

window.electronAPI.on('update-url', (event, url) => {
    document.getElementById('url').value = url;
});

displayBookmarks(); // Load and display bookmarks when the app starts
