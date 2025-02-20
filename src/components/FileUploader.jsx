import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size <= 16 * 1024 * 1024) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('File exceeds 16MB limit.');
      }
    } else {
      setError('Only PDF files are allowed.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please upload a PDF file.');
    if (!keywords.trim()) return setError('Please enter keywords.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('keywords', keywords);

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      onUploadSuccess(response.data);
    } catch (err) {
      setLoading(false);
      setError('Error processing the file.');
      onUploadError(err);
    }
  };

  return (
    <div className="file-uploader">
      <h2>Upload File and Search for Keywords</h2>

      <div className="copy-box">
        <p><strong>Suggested Key Words:</strong></p>
        <p>(please copy-paste this to the search box)</p>
        <textarea readOnly>
AIDS, acute, allerg, anxi, asthma, bacteria, bicycle, bike, birth, borne, burn, cancer, cardio, casualt, Chagas, Chikungunya, child, cholera, chronic, clean, clinic, cobenefit, co-benefit, communicable, conflict, COPD, corona, Covid, cramp, crush, cycling, DALY, dead, death, dengue, depression, diabet, diarrh, died, diet, disability, disease, displace, doctor, drink, drown, Dehydration, emergenc, endemic, epidemic, epidemiolog, exercise, exhaustion, existen, expos, gastro, handwash, harm, health, heart, HIV, hospital, humanit, hung, hygiene, illness, immune, infect, influenza, inhal, injur, kidney, killed, leishmaniasis, life, lives, lung, Lyme, malaria, measles, medic, mental, migra, MoH, morbid, mortal, mosquito, nourish, nurse, nutri, obes, onchocerciasis, paediatric, pandemic, pathogen, pediatric, pollen, pollut, potable, pregnan, preterm, pre-term, protein, psych, pulm, QALY, rash, refugee, renal, reproduc, respiratory, safe, sanita, SARS, schistosomiasis, SDG, sex, SLCP, smoke, SRHR, stress, stroke, stunt, surviv, symptom, sydemic, tick, trauma, trypanosom, typhus, trachoma, UHC, vector, violen, viral, virus, walk, WASH, welfare, wellbeing, well-being, YLL, Zika, zoon
        </textarea>
      </div>

      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label>Select file (Max size: 16MB):</label>
          <input type="file" onChange={handleFileChange} />
          {file && <p>Selected File: {file.name}</p>}
        </div>

        <div className="form-group">
          <label>Enter keywords (comma-separated):</label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows="4"
            placeholder="Enter keywords here..."
          ></textarea>
        </div>

        {loading ? <div className="spinner"></div> : <button type="submit">Upload & Search</button>}

        {error && <p className="error">⚠️ {error}</p>}
      </form>
    </div>
  );
};

export default FileUploader;
