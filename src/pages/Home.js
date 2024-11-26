import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlantIcon = () => (
  <svg 
    width="64" 
    height="64" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="plant-icon"
  >
    <path d="M12 2L12 9M12 9C10 9 8.5 10 8.5 12C8.5 14 10 15 12 15M12 9C14 9 15.5 10 15.5 12C15.5 14 14 15 12 15M12 15L12 22" />
    <path d="M3 7C3 7 6 5 9 5C12 5 12 7 12 7" />
    <path d="M21 7C21 7 18 5 15 5C12 5 12 7 12 7" />
    <path d="M3 13C3 13 6 11 9 11C12 11 12 13 12 13" />
    <path d="M21 13C21 13 18 11 15 11C12 11 12 13 12 13" />
  </svg>
);

function Home() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      handleUpload(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="content-wrapper" style={{ textAlign: 'center' }}>
        <div className="app-header">
          <PlantIcon />
          <h1 className="title">Plant Identifier</h1>
        </div>
        <p className="subtitle">
          Upload a photo of a plant to identify it
        </p>

        <div className="upload-container">
          <div className={`preview-container ${loading ? 'loading' : ''}`}>
            {loading ? (
              <div className="loading-overlay">
                <div className="loading-spinner" />
                <p>Identifying plant...</p>
              </div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-prompt">
                <PlantIcon />
                <button 
                  type="button"
                  className="select-file-button"
                  onClick={handleSelectClick}
                >
                  Upload Plant Photo
                </button>
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          aria-label="Upload image"
        />
      </div>
    </div>
  );
}

export default Home;
