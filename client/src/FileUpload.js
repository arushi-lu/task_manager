
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styling.css";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [syllabusData, setSyllabusData] = useState({});
  const [activeWeek, setActiveWeek] = useState(null);

  useEffect(() => {
    fetchSyllabusEntries();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFile(null);
      fetchSyllabusEntries(); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:5000/api/syllabus');
      fetchSyllabusEntries(); 
    } catch (error) {
      console.error('Error deleting syllabus entries:', error);
    }
  };

  const fetchSyllabusEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/syllabus');
      setSyllabusData(response.data);
    } catch (error) {
      console.error('Error fetching syllabus entries:', error);
    }
  };

  const handleWeekClick = (weekNum) => {
    setActiveWeek(activeWeek === weekNum ? null : weekNum);
  };

  return (
    <div className="file-upload-container">
      <h3 style={{ marginLeft: "10px", fontSize: "25px" }}>Upload your syllabus here:</h3>
      <input type="file" onChange={handleFileChange} name="myFile" className="upload-input" />
      <button className="upload-button" onClick={handleUpload}>Upload</button>

      {Object.keys(syllabusData).length > 0 ? (
        <>
          <h3 className="syllabus-heading">Syllabus Entries:</h3>
          <div className="week-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {Object.keys(syllabusData).map((weekNum, index) => (
              <div
                key={weekNum}
                onClick={() => handleWeekClick(weekNum)}
                className={`week-item ${activeWeek === weekNum ? 'active' : ''}`}
              >
                <h4 className="week-heading">Week: {weekNum}</h4>
                {activeWeek === weekNum && (
                  <div className='topic-dates'>
                    {syllabusData[weekNum].map((entry, entryIndex) => (
                      <div key={entryIndex}>
                        <p>Topic: {entry.coveredTopic}</p>
                        {entry.courseName && <p>Course: {entry.courseName}</p>}
                        {entry.assignmentDates.length > 0 && (
                          <div>
                            <p>Assignment Dates:</p>
                            <ul className="assignment-list">
                              {entry.assignmentDates.map((date, dateIndex) => (
                                <li key={dateIndex}>{date}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="delete-button" onClick={handleDelete}>Delete All Entries</button>
          <p className="reminder-message">
            If you want to receive reminders on upcoming assignments prior to 5 days, write to this Telegram bot
            <a className='botname' href="https://t.me/asgmtBot"> @asgmtBot</a>.
          </p>
        </>
      ) : (
        <p className="no-syllabus-message">No syllabus uploaded.</p>
      )}
    </div>
  );
};

export default FileUpload;
