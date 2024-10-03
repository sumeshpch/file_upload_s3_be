const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;

// Import the module for AWS S3 functions
const awss3connect = require("./awsS3connect");

// Define the CORS options
const corsOptions = {
    credentials: true,
    origin: ['http://localhost:4200'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));

// Multer Configuration...
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// File Upload Endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Upload the file to AWS S3 bucket in the specified subfolder
  awss3connect.uploadFileToAws(`${req.file.filename}`, `uploads/`).then((result) => {
    res.json({ message: 'File uploaded successfully', filename: result.key });
  });
});

// File Upload Endpoint
app.get('/list', (req, res) => {
  
  // Get list of files from AWS S3 bucket
  awss3connect.getListFromAws().then(function(result) {
     res.end(JSON.stringify(result.Contents));
  });
});

app.delete('/erase/:key', (req, res) => {

  // Erase a file from AWS S3 bucket
  awss3connect.eraseFileFromAws(req.params.key).then(function(result) {
     res.json({ message: 'File erased successfully', filename: req.params.key });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});