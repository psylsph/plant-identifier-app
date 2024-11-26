import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);

    try {
      // Convert the file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        try {
          const response = await axios.post('/.netlify/functions/identify-plant', {
            image: base64Image
          });

          navigate('/result', { state: { result: response.data } });
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to identify plant. Please try again.');
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

  return (
    <div className="container">
      <h1 className="title">Plant Identifier</h1>
      <p className="subtitle">
        Upload a photo of a plant to identify it
      </p>

      <div className="upload-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <button className="button" onClick={() => document.getElementById('file-input').click()}>
            Select Image
          </button>
        </label>

        {previewUrl && (
          <div>
            <img src={previewUrl} alt="Preview" className="preview-image" />
          </div>
        )}

        <button
          className="button"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          {loading ? 'Identifying...' : 'Identify Plant'}
        </button>
      </div>
    </div>
  );
}

export default Home;
