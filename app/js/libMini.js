// libMini.load(fileName) loads into #library.ul, the sidebar library 'Series'

const $ = require('jquery');
const directory = require('./directory.js');
const fs = require('fs');
const isComic = require('./isComic.js');
const path = require('path');

// Autoloads the sidebar library
exports.load = (fileName) => {
  let baseName = path.basename(fileName);
  let filePath = path.dirname(fileName);
  let dirContents = fs.readdirSync(filePath);

  $('.libFile').remove();
  $('.libDir').remove();
  for (let i = 0; i < dirContents.length; i++) {
    let comic = dirContents[i];
    if (fs.statSync(path.join(filePath, comic)).isFile() && isComic(comic)) {
      if (dirContents[i] === baseName) {
        $('#dirLib').append(`
          <li class="libFile current">
            <span>
              <i class="fa fa-file" aria-hidden="true"></i>
              ${comic.slice(0, -4)}
            </span>
          </li>`
        );
      } else {
        let file = directory.encode(path.join(filePath, comic));
        $('#dirLib').append(`
          <li class="libFile">
            <a href="#" onclick="file.loader('${file}')">
              <i class="fa fa-file" aria-hidden="true"></i>
              ${comic.slice(0, -4)}
            </a>
          </li>`
        );
      }
    }
  }
};
