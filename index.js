const fs = require("fs");
const path = require("path");
var project = process.argv[2];

// "public" klasörünün yolu
const publicDir = path.join(__dirname, "public");

// .firebaserc dosyasının yolu
const firebaseRcPath = path.join(__dirname, ".firebaserc");

function replaceOguzWithYunusAndLogo(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Dosya okunamadı: ${filePath}`, err);
      return;
    }
    let result;

    if (project == "betondelme") {
      result = data.replace(/Oğuz/g, "Beton Delme");
      result = result.replace(/logo\.png/g, "betondelme.png");
    } else if (project == "betonkesme") {
      result = data.replace(/Beton Delme/g, "Beton Keseme");
      result = result.replace(/betondelme\.png/g, "betonkesme.png");
    } else {
    }

    fs.writeFile(filePath, result, "utf8", (err) => {
      if (err) {
        console.error(`Dosya yazılamadı: ${filePath}`, err);
      } else {
        console.log(`Dosya güncellendi: ${filePath}`);
      }
    });
  });
}

// Klasördeki dosyaları tarayan ve işleyen fonksiyon
function processDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Klasör okunamadı: ${directory}`, err);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(directory, file);

      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error(`Dosya durumu alınamadı: ${fullPath}`, err);
          return;
        }

        if (stats.isDirectory()) {
          processDirectory(fullPath);
        } else if (stats.isFile() && path.extname(fullPath) === ".html") {
          replaceOguzWithYunusAndLogo(fullPath);
        }
      });
    });
  });
}

// .firebaserc dosyasını güncelleyen fonksiyon
function updateFirebaseRc() {
  fs.readFile(firebaseRcPath, "utf8", (err, data) => {
    if (err) {
      console.error(`.firebaserc dosyası okunamadı: ${firebaseRcPath}`, err);
      return;
    }

    let firebaseRc;
    try {
      firebaseRc = JSON.parse(data);
    } catch (e) {
      console.error(`JSON parse hatası: ${firebaseRcPath}`, e);
      return;
    }

    if (project == "betonkesme") {
      firebaseRc.projects.default = "betonkesme-3b758";
    } else if (project == "betondelme") {
      firebaseRc.projects.default = "betondelme-81321";
    } else {
      firebaseRc.projects.default = "oguzinsaat-c6536";
    }

    fs.writeFile(
      firebaseRcPath,
      JSON.stringify(firebaseRc, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error(
            `.firebaserc dosyası yazılamadı: ${firebaseRcPath}`,
            err,
          );
        } else {
          console.log(`.firebaserc dosyası güncellendi: ${firebaseRcPath}`);
        }
      },
    );
  });
}

// İşleme başla
processDirectory(publicDir);
updateFirebaseRc();
