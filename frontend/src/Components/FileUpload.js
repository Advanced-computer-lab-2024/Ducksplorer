// import React, { useState } from 'react';
// import axios from 'axios';
// import './FileUpload.css';

// const FileUpload = () => {
//     const [files, setFiles] = useState([null]); // Initialize with one null entry

//     const handleFileChange = (e, index) => {
//         const newFiles = [...files];
//         newFiles[index] = e.target.files[0];
//         setFiles(newFiles);
//     };

//     const addFileInput = () => {
//         setFiles([...files, null]);
//     };

//     const removeFileInput = (index) => {
//         const newFiles = files.filter((_, i) => i !== index);
//         setFiles(newFiles);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         files.forEach((file, index) => {
//             if (file) {
//                 formData.append(`file${index}`, file);
//             }
//         });

//         try {
//             await axios.post('http://localhost:8000/file/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             alert('Files uploaded successfully');
//         } catch (error) {
//             console.error('Error uploading files:', error);
//             alert('Failed to upload files');
//         }
//     };

//     return (
//         <div className="file-upload-container">
//             <form className="file-upload-form" onSubmit={handleSubmit}>
//                 {files.map((file, index) => (
//                     <div key={index} className="file-input-container">
//                         <input
//                             type="file"
//                             onChange={(e) => handleFileChange(e, index)}
//                             className="file-input"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => removeFileInput(index)}
//                             className="remove-button"
//                         >
//                             Remove
//                         </button>
//                     </div>
//                 ))}
//                 <button type="button" onClick={addFileInput} className="add-button">
//                     +
//                 </button>
//                 <button type="submit" className="upload-button">
//                     Upload
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default FileUpload;
////////
import React, { useState } from 'react';
import { Button, Input } from '@mui/material';

const FileUpload = ({ onFileSelect, inputId, label }) => {
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setFileNames(files.map(file => file.name));
      onFileSelect(files); // Pass selected files array to parent component
    } else {
      setFileNames([]);
      onFileSelect([]);
    }
  };

  return (
    <div>
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={inputId}
      />
      <label htmlFor={inputId}>
        <Button variant="outlined" component="span">
          Upload Document
        </Button>
      </label>
      <div>{fileNames.join(', ')}</div> 
    </div>
  );
};

export default FileUpload;


