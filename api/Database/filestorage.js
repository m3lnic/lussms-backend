const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    region: process.env.AWS_S3_REGION
});

const s3 = new aws.S3();

const uploadLogo = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: function (req, file, cb) {
            var newFileName = Date.now();
            var fullPath = 'logo/' + newFileName;
            cb(null, fullPath);
        }
    })
});

module.exports = uploadLogo;
