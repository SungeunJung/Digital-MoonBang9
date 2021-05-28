const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require("aws-sdk");

const s3 = new AWS.S3({ 
    accessKeyId: process.env.S3_ACCESS_KEY_ID, //노출주의
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, //노출주의
    region: process.env.S3_REGION, //노출주의
});

const storageUserProfile = multerS3({ 
    s3: s3,
    bucket: 'myuploads1697/userProfile',
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname }) 
    },
    key: function (req, file, cb) { 
        cb(null, `${Date.now()}_${file.originalname}`)
    },
});

const storageTemplateImage = multerS3({ 
    s3: s3,
    bucket: 'myuploads1697/templateImage',
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname }) 
    },
    key: function (req, file, cb) { 
        cb(null, `${Date.now()}_${file.originalname}`)
    },
});

const storageTemplateFile = multerS3({ 
    s3: s3,
    bucket: 'myuploads1697/templateFile',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition : 'attachment',
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname }) 
    },
    key: function (req, file, cb) { 
        cb(null, `${Date.now()}_${file.originalname}`)
    },
});

const storageQuillEditor = multerS3({ 
    s3: s3,
    bucket: 'myuploads1697/quillEditor',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname }) 
    },
    key: function (req, file, cb) { 
        cb(null, `${Date.now()}_${file.originalname}`)
    },
});

exports.uploadUserProfile = multer({ storage : storageUserProfile });
exports.uploadTemplateImage = multer({ storage : storageTemplateImage });
exports.uploadTemplateFile = multer({ storage : storageTemplateFile });
exports. uploadQuillEditor = multer({ storage : storageQuillEditor });