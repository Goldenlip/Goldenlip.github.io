const fs = require('fs');
const path = require('path');

function buildMusicLibrary(dir) {
    let musicLibrary = [];

    function traverseDirectory(currentPath) {
        const files = fs.readdirSync(currentPath);

        files.forEach(file => {
            const fullPath = path.join(currentPath, file);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                // Recursively scan subdirectories
                traverseDirectory(fullPath);
            } else if (file.endsWith('.mp3')) {
                // Extract metadata from path or filename
                const artist = path.basename(currentPath);
                const songName = path.basename(file, '.mp3');

                musicLibrary.push({
                    name: songName,
                    artist: artist,
                    src: fullPath
                });
            }
        });
    }

    traverseDirectory(dir);
    return musicLibrary;
}

// Example Usage
const library = buildMusicLibrary('./Musics');
console.log(library);
