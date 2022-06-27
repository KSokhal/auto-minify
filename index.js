const chokidar = require('chokidar');
const path = require('path')
const { minify } = require("terser");
const fs = require('fs');
var CleanCSS = require('clean-css');

const basePath = process.argv[2];
if (!basePath) {
    console.log("Please provide a base directory path")
    process.exitCode = 1;
    throw new Error('Base directory path not provided');
};

chokidar.watch(basePath + '**/static/src/**').on('change', (filepath) => {

    try {
        //  Get file information
        const ext = path.extname(filepath);
        var initialCode = fs.readFileSync(filepath, "utf8");

        var destinationPath = filepath.replace('\src', '').replace(ext, `.min${ext}`)

        switch (ext) {
            case '.js':
                var minifiedCode = minify(initialCode)

                minifiedCode.then((result) => {
                    fs.writeFileSync(destinationPath, result.code, "utf8");
                });
                break;
            case '.css':
                var minifiedCode = new CleanCSS({ level: 2 }).minify(initialCode);

                fs.writeFileSync(destinationPath, minifiedCode.styles, "utf8");
                break;
            default:
                break;
        }

        var currentDate = new Date();
        console.log(`${currentDate.toLocaleTimeString()} - Minified '${filepath}'`)
    } catch (err) {
        console.log(`Failed to minify ${filepath}: ${err}`);
    };
});

