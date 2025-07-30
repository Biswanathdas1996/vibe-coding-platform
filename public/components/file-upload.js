/**
 * @file Handles file uploads (W-2, 1099, etc.)
 */

import { useState, useEffect, useRef } from 'react';

/**
 * @typedef {Object} FileUploadProps
 * @property {function} onFileSelected - Callback function to handle selected file.
 * @property {string} acceptedTypes - Accepted file types.
 */

/**
 * File upload component.
 * @param {FileUploadProps} props - Component properties.
 * @returns {JSX.Element} - File upload component.
 */
const FileUpload = ({ onFileSelected, acceptedTypes = '.csv,.pdf,.txt' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Handles file selection.
   * @param {Event} event - Change event.
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!acceptedTypes.includes(file.type.toLowerCase()) && !acceptedTypes.split(',').some(type => file.name.toLowerCase().endsWith(type))) {
      setError(`Please select a file with type: ${acceptedTypes}`);
      setSelectedFile(null);
      return;
    }
    try {
      setError(null);
      setSelectedFile(file);
      await onFileSelected(file);
    } catch (e) {
      setError(`Error processing file: ${e.message}`);
    }
  };


  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    handleFileChange({ target: { files: [file] } });
  };


  return (
    <div className="file-upload" onDragOver={handleDragOver} onDrop={handleDrop}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current.click()}>Select File</button>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Drag and drop files here</p>
    </div>
  );
};

export default FileUpload;