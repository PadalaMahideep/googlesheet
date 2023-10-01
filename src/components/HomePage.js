import React, { useState } from "react";
import Papa from "papaparse";
import DisplayData from "./DisplayData";

function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setCsvData(result.data);
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  };

  return (
    <div>
      <h2>CSV File Upload</h2>
      <input type="file" accept=".csv" onChange={handleFileSelect} />
      <br />
      <br />
      {csvData.length > 0 && <DisplayData csvData={csvData} />}
    </div>
  );
}

export default HomePage;
