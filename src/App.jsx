import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import SearchResults from './components/SearchResults';
import './App.css';

function App() {
  const [results, setResults] = useState(null);

  const handleUploadSuccess = (data) => {
    console.log('Upload Successful:', data);
    setResults(data);
  };

  const handleUploadError = (err) => {
    console.error('Upload Failed:', err);
  };

  const handleBack = () => {
    setResults(null);
  };

  return (
    <div className="App">
      {!results ? (
        <FileUploader
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      ) : (
        <SearchResults results={results} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
