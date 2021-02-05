const chokidar = require('chokidar');
const path = require('path')
const { minify } = require("terser");
const fs = require('fs');
var CleanCSS = require('clean-css');

// const mainPath = "./";
const mainPath = '../myriad/myriad/myriad_app/static/'

// list all files in the directory
// fs.readdir(mainPath, (err, files) => {
//     if (err) {
//         throw err;
//     }

//     // files object contains all files names
//     // log them on console
//     files.forEach(file => {
//         console.log(file);
//     });
// });

chokidar.watch(mainPath + 'src').on('change', (filepath) => {
    //   console.log(filepath);
    try {
        const ext = path.extname(filepath);
        var initialCode = fs.readFileSync(filepath, "utf8");
        var destinationPath = filepath.replace('src', './').replace(ext, `.min${ext}`)

        if (ext == '.js') {
            var minifiedCode = minify(initialCode)
            
            minifiedCode.then((result) => {
                fs.writeFileSync(destinationPath, result.code, "utf8");
            });

            let currentDate = new Date();
            let date = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            let time  = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

            console.log(`${date} ${time} - Minified '${filepath}'`)
        } else if (ext == '.css') {
            var minifiedCode =  new CleanCSS().minify(initialCode);

            fs.writeFileSync(destinationPath, minifiedCode.styles, "utf8");

            let currentDate = new Date();
            let date = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            let time  = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

            console.log(`${date} ${time} - Minified '${filepath}'`)
        }
        
    } catch (err) {
        console.log(`Failed to minify ${filepath}: ${err}`);
    };
});

