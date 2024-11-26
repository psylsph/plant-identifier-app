import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        try {
          const apiUrl = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8888/.netlify/functions/identify-plant'
            : '/.netlify/functions/identify-plant';
            
          const response = await axios.post(apiUrl, {
            image: base64Image
          });

          if (!response.data || !response.data.suggestions || response.data.suggestions.length === 0) {
            throw new Error('No plants identified in the image');
          }

          navigate('/result', { state: { result: response.data, imageUrl: previewUrl } });
        } catch (error) {
          console.error('Error:', error);
          navigate('/result', { state: { result: null, error: error.message } });
          setLoading(false);
        }
      };

      reader.onerror = () => {
        alert('Failed to read the image file. Please try again.');
        setLoading(false);
      };
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process the image. Please try again.');
      setLoading(false);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      handleUpload(file); // Automatically start upload when file is selected
    } else {
      alert('Please select an image file');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="content-wrapper" style={{ textAlign: 'center' }}>
        <h1 className="title">Plant Identifier</h1>
        <p className="subtitle">
          Upload a photo of a plant to identify it
        </p>

        <div className="upload-container">
          <div
            className={`preview-container ${loading ? 'loading' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {loading ? (
              <div className="loading-overlay">
                <div className="loading-spinner" />
                <p>Identifying plant...</p>
              </div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="drop-zone-text">
                <p>Drag & drop an image here</p>
                <p>or</p>
                <label htmlFor="file-input" className="select-file-label">
                  Click to select
                </label>
              </div>
            )}
            <div className={`drop-zone ${isDragging ? 'active' : ''}`}>
              Drop image here
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
