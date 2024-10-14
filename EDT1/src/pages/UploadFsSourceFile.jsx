import React, { useState, useRef } from 'react';
import { Box, Button, Avatar, Typography, Stack, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Importing PDF icon
import '../styles/UploadFsSourceFile.css'; // Ensure your custom styles are retained or updated as needed

const MAX_FILE_SIZE = 800 * 1024; // 800KB

const UploadFsSourceFile = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [client, setClient] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handler for file selection
  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setUploadError('Please select a PDF file.');
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadError('File size exceeds the maximum limit of 800KB');
        return;
      }

      // Clear previous errors and set selected file
      setUploadError('');
      setSelectedFile(file);

      // Generate preview (optional for PDFs, could display file name or icon)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile || !client) {
      setUploadError('Please select a file and enter a client name.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('Client', client);

    setLoading(true);

    try {
      const response = await axios.post(
        'https://easydash.azurewebsites.net/api/processfile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const result = response.data;
        if (result) {
          alert('File processed successfully!');
          console.log(result);
          navigate('/view'); // Navigate to the 'view' page
        } else {
          alert('File processed successfully, but no data returned.');
        }
      } else {
        const error = response.data;
        if (error && error.message) {
          setUploadError(`Error: ${error.message}`);
        } else {
          setUploadError('Error: Unable to process the file.');
        }
      }
    } catch (error) {
      setUploadError(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler to reset the form
  const handleReset = () => {
    setSelectedFile(null);
    setClient('');
    setPreviewImage(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box className="rollquick-upload-container" sx={{ maxWidth: 600, margin: '0 auto', padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Upload PDF File
      </Typography>
      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack spacing={3}>
          {/* Client Name Input */}
          <TextField
            label="Client Name"
            variant="outlined"
            fullWidth
            required
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />

          {/* File Selection and Preview */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select PDF File
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {selectedFile ? (
                <Avatar
                  variant="square"
                  sx={{ width: 100, height: 100, bgcolor: 'grey.200' }}
                >
                  <PictureAsPdfIcon sx={{ fontSize: 60, color: 'red' }} />
                </Avatar>
              ) : (
                <Avatar
                  variant="square"
                  sx={{ width: 100, height: 100, bgcolor: 'grey.200' }}
                >
                  <PictureAsPdfIcon sx={{ fontSize: 60, color: 'red' }} />
                </Avatar>
              )}
              <Button
                variant="contained"
                component="label"
                size="large"
              >
                Select PDF
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileSelected}
                  accept="application/pdf"
                />
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Stack>
            {uploadError && (
              <Typography color="error" mt={2}>
                {uploadError}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" mt={1}>
              Allowed file type: PDF. Max size: 800KB.
            </Typography>
          </Box>

          {/* Submit Button */}
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default UploadFsSourceFile;