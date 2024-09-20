// addRow.js
document.getElementById('addButton').addEventListener('click', function () {
    // Get input values
    const process = document.getElementById('processInput').value;
    const arrivalTime = document.getElementById('arrivalTimeInput').value;
    const burstTime = document.getElementById('burstTimeInput').value;
  
    // Create a new row with the input values
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <th scope="row">${process}</th>
      <td>${arrivalTime}</td>
      <td>${burstTime}</td>
    `;
  
    // Insert the new row before the input row
    const inputRow = document.getElementById('inputRow');
    inputRow.parentNode.insertBefore(newRow, inputRow);
  
    // Clear input fields for new entry
    document.getElementById('processInput').value = '';
    document.getElementById('arrivalTimeInput').value = '';
    document.getElementById('burstTimeInput').value = '';
  });
  
