import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const handleTryAgain = () => {
    navigate('/');
  };

  if (!result || !result.suggestions || result.suggestions.length === 0) {
    return (
      <div className="container">
        <div className="result-container error-container">
          <h2>Detection Failed</h2>
          <p>We couldn't identify any plants in this image. This might be because:</p>
          <ul>
            <li>The image quality was too low</li>
            <li>The plant wasn't clearly visible</li>
            <li>The image didn't contain a plant</li>
          </ul>
          <button className="button" onClick={handleTryAgain}>
            Try Another Picture
          </button>
        </div>
      </div>
    );
  }

  const suggestion = result.suggestions[0];
  const probability = Math.round(suggestion.probability * 100);

  return (
    <div className="container">
      <div className="result-container">
        <div className="result-header">
          <img 
            src={result.images[0].url || location.state.imageUrl} 
            alt="Uploaded plant"
            className="result-image"
          />
          <div className="result-info">
            <h2 className="plant-name">{suggestion.plant_name}</h2>
            <p className="scientific-name">{suggestion.plant_details.scientific_name}</p>
            <span className="confidence">
              {probability}% Match
            </span>
          </div>
        </div>

        <div className="details-section">
          <h3>Plant Details</h3>
          <div className="details-grid">
            {suggestion.plant_details.common_names && (
              <div className="detail-item">
                <h4>Common Names</h4>
                <p>{suggestion.plant_details.common_names.join(', ')}</p>
              </div>
            )}
            
            {suggestion.plant_details.taxonomy && (
              <div className="detail-item">
                <h4>Taxonomy</h4>
                <p>Family: {suggestion.plant_details.taxonomy.family}</p>
                <p>Genus: {suggestion.plant_details.taxonomy.genus}</p>
              </div>
            )}
          </div>

          {suggestion.plant_details.wiki_description && (
            <div className="detail-item" style={{ marginTop: '1rem' }}>
              <h4>Description</h4>
              <p>{suggestion.plant_details.wiki_description.value}</p>
              {suggestion.plant_details.wiki_description.citation && (
                <p className="citation">
                  Source: {suggestion.plant_details.wiki_description.citation}
                </p>
              )}
            </div>
          )}

          {suggestion.plant_details.url && (
            <div className="detail-item" style={{ marginTop: '1rem' }}>
              <h4>Learn More</h4>
              <a 
                href={suggestion.plant_details.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="learn-more-link"
              >
                View on Wikipedia
              </a>
            </div>
          )}
        </div>

        <div className="button-container">
          <button className="button" onClick={handleTryAgain}>
            Identify Another Plant
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
