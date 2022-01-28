const chokidar = require('chokidar');
const path = require('path')
const { minify } = require("terser");
const fs = require('fs');
var CleanCSS = require('clean-css');

// const mainPath = "./";
const mainPath = '../myriad/myriad_app/static/'

chokidar.watch(mainPath + 'src').on('change', (filepath) => {
    try {
        const ext = path.extname(filepath);
        var initialCode = fs.readFileSync(filepath, "utf8");
        var destinationPath = filepath.replace('src', './').replace(ext, `.min${ext}`)

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
        console.log(`${currentDate.toLocaleTimeString()} - Minified '${filepath.replace(mainPath, "")}'`)
    } catch (err) {
        console.log(`Failed to minify ${filepath}: ${err}`);
    };
});

