const fs = require('fs')

const saveFiles = function (req, res, next) {

    if (!req.files) {
        let err = new Error('The file was not attached');
        err.status = 400;
        throw err;
    }

    if (isUploadTXTFile(req.files)) {

        let fileName = Date.now();
        let txtFile = req.files.file;

        let filePath = '/../public/data/' + fileName + '.txt';
        txtFile.mv(__dirname + filePath, function (err) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                req.filePath = filePath;
                next();
            }
        });

    } else {
        let err = new Error('Invalid file type was attached');
        err.status = 400;
        throw err;
    }

};

const isUploadTXTFile = (uploadfiles) => {
    return uploadfiles.file && uploadfiles.file.mimetype === "text/plain";
}


const removeFile = async (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err)
            return;
        }
        console.log('filePath was deleted');
        //file removed
    })

};

module.exports = {
    saveFiles,
    removeFile
};

