const path = require('path');
const fs = require('fs');

module.exports = class Scanner {

    scandDir(filepath) {
        if (fs.existsSync(filepath)) {
            var files = fs.readdirSync(filepath);
            files.forEach(f => {
                var filename = path.join(filepath, f);
                var stat = fs.lstatSync(filename);
                if (stat.isDirectory()) {
                    this.scandDir(filename);
                } else if (filename.indexOf(".js") >= 0) {
                    Loader.load(filename);
                }
            });
        }
    }

}