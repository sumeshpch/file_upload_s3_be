const { S3Client, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const AWS = require('aws-sdk');
const fs = require('fs');

// Set the region and access keys
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

// Create a new instance of the S3 class
const s3 = new AWS.S3();

exports.uploadFileToAws = async (fileName, filePath) => {

    // Set the parameters for the file you want to upload
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fs.createReadStream(filePath + fileName)
    };

    try {
        // Upload the file to S3
        return await s3.upload(uploadParams).promise();
    } catch (err) {
      console.error('Error ', err);
      return {message: 'Please try later'};
    }
};


exports.getListFromAws = async () => {

    const listParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Delimiter: '',
      Prefix: ''
    };

    try {
        return await s3.listObjectsV2(listParams).promise();
    } catch (err) {
        return {Contents: null, message: 'Please try later'};
    }
};

exports.eraseFileFromAws = async (fileName) => {
    const eraseParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    try {
        return await s3.deleteObject(eraseParams).promise();
    } catch (err) {
        return {Contents: null, message: 'Please try later'};
    }
};
