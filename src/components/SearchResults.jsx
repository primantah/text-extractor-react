import React from 'react';
//import './App.css';

const SearchResults = ({ results, onBack }) => {
  return (
    <div className="container">
      <h1>Search Results</h1>
        {results && results.length > 0 ? (
        results.map(([keyword, info], index) => (
            <div key={index} className="result-item">
            <h3>{keyword}: {info.exists ? '✅ Found' : '❌ Not Found'}</h3>
            {info.exists && (
                <>
                <p><strong>Pages:</strong> {info.pages.join(', ')}</p>
                <p><strong>Sentences:</strong></p>
                <ul>
                    {Object.entries(info.sentences).map(([page, sentences]) => (
                    <li key={page}><strong>Page {page}:</strong>
                        <ul>
                        {sentences.map((s, idx) => <li key={idx}>{s.text}</li>)}
                        </ul>
                    </li>
                    ))}
                </ul>
                </>
            )}
            </div>
        ))
        ) : (
        <p>No results found.</p>
        )}

      <button onClick={onBack}>Back to Upload</button>
    </div>
  );
};

export default SearchResults;
