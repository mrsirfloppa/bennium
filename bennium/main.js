const { app, BrowserWindow, ipcMain, shell, BrowserView } = require('electron');
const path = require('path');

let mainWindow;
let currentView = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile('index.html').catch(err => console.error('Failed to load index.html:', err));

    // Function to set the BrowserView bounds correctly
    const setBrowserViewBounds = () => {
        if (currentView) {
            const { width, height } = mainWindow.getContentBounds();
            const navbarHeight = 50;
            const bookmarksHeight = 25;
            currentView.setBounds({
                x: 0,
                y: navbarHeight + bookmarksHeight, // Adjust to start right below the navbar and bookmarks
                width: width,
                height: height - (navbarHeight + bookmarksHeight), // Adjust height to avoid overlap
            });
        }
    };

    // Handle window resizing
    mainWindow.on('resize', setBrowserViewBounds);

    // Create a new BrowserView when navigating
    ipcMain.on('navigate', (event, url) => {
        if (!currentView) {
            currentView = new BrowserView({
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js'),
                    contextIsolation: true,
                    enableRemoteModule: false,
                    nodeIntegration: false,
                },
            });
            mainWindow.setBrowserView(currentView);
            setBrowserViewBounds();

            // Update the URL and title when navigation occurs
            currentView.webContents.on('did-navigate', (event, newUrl) => {
                mainWindow.webContents.send('update-url', newUrl);
                mainWindow.webContents.send('update-title', currentView.webContents.getTitle());
            });

            currentView.webContents.on('did-navigate-in-page', (event, newUrl) => {
                mainWindow.webContents.send('update-url', newUrl);
                mainWindow.webContents.send('update-title', currentView.webContents.getTitle());
            });
        }

        currentView.webContents.loadURL(url).catch(err => {
            console.error(`Failed to load URL (${url}):`, err);
        });
    });

    ipcMain.on('goBack', () => {
        if (currentView && currentView.webContents.navigationHistory.canGoBack) {
            currentView.webContents.navigationHistory.goBack();
        }
    });

    ipcMain.on('goForward', () => {
        if (currentView && currentView.webContents.navigationHistory.canGoForward) {
            currentView.webContents.navigationHistory.goForward();
        }
    });

    ipcMain.on('reload', () => {
        if (currentView) {
            currentView.webContents.reload();
        }
    });

    ipcMain.on('open-external', (event, url) => {
        shell.openExternal(url).catch(err => {
            console.error('Failed to open external URL:', err);
        });
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
