import multer from 'multer';

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, date + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/svg' ||
        file.mimetype === 'image/gift'
    ) {

        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;