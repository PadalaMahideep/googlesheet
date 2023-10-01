import React, { useState, useEffect } from "react";

function DisplayData({ csvData }) {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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

  const handleColumnSelect = (event) => {
    const columnName = event.target.value;
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };

  return (
    <div>
      <h2>Data Display and Filter</h2>

      <p>Select columns to filter:</p>
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

export default DisplayData;
