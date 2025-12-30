exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    res.send({
        message: 'File uploaded successfully',
        filePath: `/uploads/${req.file.filename}`
    });
};