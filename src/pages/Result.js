import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="container">
        <h1 className="title">No Results Available</h1>
        <button className="button" onClick={() => navigate('/')}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Plant Identification Results</h1>
      
      {result.suggestions && result.suggestions.length > 0 ? (
        result.suggestions.map((suggestion, index) => (
          <div key={index} className="result-card">
            <h2 className="plant-name">{suggestion.plant_name}</h2>
            {suggestion.plant_details.common_names && (
              <p className="common-names">
                Common names: {suggestion.plant_details.common_names.join(', ')}
              </p>
            )}
            <p className="probability">
              Probability: {Math.round(suggestion.probability * 100)}%
            </p>
            {suggestion.plant_details.description && (
              <p className="description">
                {suggestion.plant_details.description.value}
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="no-results">
          No plants identified. Please try again with a different image.
        </p>
      )}

      <button className="button" onClick={() => navigate('/')}>
        Identify Another Plant
      </button>
    </div>
  );
}

export default Result;
