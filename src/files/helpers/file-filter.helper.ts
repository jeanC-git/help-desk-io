

export const FileFilter = (req: Express.Request, file: Express.Multer.File, callback) => {
    
    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    // if (validExtensions.includes(fileExtension)) {
        return callback(null, true);
    // }

    callback(null, false);
}