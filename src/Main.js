import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import Modal from "react-modal";

function Main() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    // Filter data based on selected columns whenever selectedColumns or csvData changes
    const filtered = csvData.map((row) =>
      selectedColumns.reduce((obj, col) => {
        obj[col] = row[col];
        return obj;
      }, {})
    );
    setFilteredData(filtered);
  }, [selectedColumns, csvData]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0] || event.dataTransfer.files[0];
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setCsvData(result.data);
        const columns = result.meta.fields || [];
        setSelectedColumns(columns);
        setIsFilterModalOpen(true); // Open the filter modal after importing

        // After parsing the CSV, you can now import the data into Google Sheets
        // importCsvDataToGoogleSheets(result.data);
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    handleFileSelect({ target: { files: [file] } });
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const closeModal = () => {
    setIsFilterModalOpen(false);
  };

  // ... Your existing code ...

  const handleColumnSelect = (event) => {
    const columnName = event.target.value;
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };

  // ... Your existing code ...

  useEffect(() => {
    // Filter data based on selected columns whenever selectedColumns or csvData changes
    const filtered = csvData.map((row) =>
      selectedColumns.reduce((obj, col) => {
        obj[col] = row[col];
        return obj;
      }, {})
    );
    setFilteredData(filtered);
  }, [selectedColumns, csvData]);

  // ... Rest of your code ...

  return (
    <div>
      <h2>CSV Importer</h2>
      <div
        id="drop-area"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleFileDrop}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <p>Drag &amp; drop a CSV file here, or click to select one.</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        <button onClick={openFileInput}>Select File</button>
      </div>

      <br />
      <br />
      <p>Select columns to import:</p>
      {csvData.length > 0 &&
        Object.keys(csvData[0]).map((column) => (
          <label key={column}>
            <input
              type="checkbox"
              value={column}
              onChange={handleColumnSelect}
              checked={selectedColumns.includes(column)}
            />
            {column}
          </label>
        ))}
      <br />
      <br />

      <Modal
        isOpen={isFilterModalOpen}
        onRequestClose={closeModal}
        contentLabel="Filter Columns"
      >
        <h2>Filter Columns</h2>
        <div>
          {csvData.length > 0 &&
            Object.keys(csvData[0]).map((column) => (
              <label key={column}>
                <input
                  type="checkbox"
                  value={column}
                  onChange={handleColumnSelect}
                  checked={selectedColumns.includes(column)}
                />
                {column}
              </label>
            ))}
        </div>
        <button onClick={closeModal}>Close</button>
      </Modal>

      <div>
        <h3>Filtered Data</h3>
        <table>
          <thead>
            <tr>
              {selectedColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {selectedColumns.map((column) => (
                  <td key={column}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Main;
