
// generateArrays.js
document.getElementById('generateButton').addEventListener('click', function () {
  // clear the output section
  clearOutput();
  // Initialize empty arrays
  const processIds = [];
  const arrivalTimes = [];
  const burstTimes = [];

  // Get all table rows except the input row
  const rows = document.querySelectorAll('#processTable tbody tr:not(#inputRow)');

  // Loop through each row to get the process data
  rows.forEach(row => {
    const cells = row.getElementsByTagName('td');

    // Push values into respective arrays
    processIds.push(row.cells[0].textContent.trim());
    arrivalTimes.push(parseInt(cells[0].textContent.trim()));
    burstTimes.push(parseInt(cells[1].textContent.trim()));
  });

  // Log the arrays to the console (you can modify this to use the arrays elsewhere)
  // check selected algorithm
  const seletedAlgo = document.querySelector('input[name="flexRadioDefault"]:checked');
  if (seletedAlgo.id == 'flexRadioDefault1') {
    // fcfs
    fcfs(processIds, arrivalTimes, burstTimes);
  }
  else if (seletedAlgo.id == 'flexRadioDefault2') {
    // sjf
    sjf(processIds, arrivalTimes, burstTimes);
  }
  else if (seletedAlgo.id == 'flexRadioDefault3') {
    // priority
  }
  else {
    // robinson
  }

});

function clearOutput() {
  document.getElementById("selectedAlgoHeading").innerText = '';
  document.getElementById("resultTable").innerHTML = '';
  document.getElementById("showAVGTAT").innerText = '';
  document.getElementById("showAVGWT").innerText = '';
  document.getElementById("progressContainer").innerHTML = '';
}


function fcfs(processIds, arrivalTimes, burstTimes) {
  const n = processIds.length;
  const completionTimes = new Array(n).fill(0);
  const turnaroundTimes = new Array(n).fill(0);
  const waitingTimes = new Array(n).fill(0);
  let avgTAT = 0;
  let avgWT = 0;

  // Step 1: Sort processes by arrival time
  const processes = processIds.map((id, index) => ({
    id: id,
    arrivalTime: arrivalTimes[index],
    burstTime: burstTimes[index],
    originalIndex: index,
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);

  // Step 2: Calculate Completion Time (CT)
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      completionTimes[i] = processes[i].arrivalTime + processes[i].burstTime;
    } else {
      completionTimes[i] = Math.max(completionTimes[i - 1], processes[i].arrivalTime) + processes[i].burstTime;
    }

    // Step 3: Calculate Turnaround Time (TAT = CT - AT)
    turnaroundTimes[i] = completionTimes[i] - processes[i].arrivalTime;
    avgTAT += turnaroundTimes[i];

    // Step 4: Calculate Waiting Time (WT = TAT - BT)
    waitingTimes[i] = turnaroundTimes[i] - processes[i].burstTime;
    avgWT += waitingTimes[i];
  }
  avgTAT /= n;
  avgWT /= n;

  // Step 5: Create an array of results to sort by original process order
  const results = processes.map((process, index) => ({
    id: process.id,
    arrivalTime: process.arrivalTime,
    burstTime: process.burstTime,
    completionTime: completionTimes[index],
    turnaroundTime: turnaroundTimes[index],
    waitingTime: waitingTimes[index],
    originalIndex: process.originalIndex
  })).sort((a, b) => a.originalIndex - b.originalIndex);

  // Step 6: Generate HTML Table
  // let tableHTML = "<table class='table' border='1'><tr><th>Process No</th><th>AT</th><th>BT</th><th>CT</th><th>TAT</th><th>WT</th></tr>";
  let tableHTML = "<table class='table'><thead><tr><th scope='col'>Process No</th><th scope='col'>AT</th><th scope='col'>BT</th><th scope='col'>CT</th><th scope='col'>TAT</th><th scope='col'>WT</th></tr></thead>"

  for (let i = 0; i < n; i++) {
    tableHTML += `<tr>
      <td>P<sub>${results[i].id}</sub></td>
      <td>${results[i].arrivalTime}</td>
      <td>${results[i].burstTime}</td>
      <td>${results[i].completionTime}</td>

      <td>${results[i].turnaroundTime}</td>
      <td>${results[i].waitingTime}</td>
    </tr>`;
  }

  tableHTML += "</table>";

  // heading
  document.getElementById("selectedAlgoHeading").innerText = "First Come First Serve"
  // Display the table in the HTML element
  document.getElementById("resultTable").innerHTML = tableHTML;
  // avgTAT & avgWT
  document.getElementById("showAVGTAT").innerText = "Average Turn-around Time: " + avgTAT;
  document.getElementById("showAVGWT").innerText = "Average Waiting Time: " + avgWT;

  // check simulation status
  const simulationStatus = document.getElementById("simulationStatus");
  // if (simulationStatus.)
  if (simulationStatus.checked) {
    fcfsSimulator(processIds, arrivalTimes, burstTimes);
  }
}

function fcfsSimulator(processIds, arrivalTimes, burstTimes) {
  const n = processIds.length;
  let placeHolder = document.getElementById("progressContainer");

  // creating the view
  for (let i = 0; i < n; i++) {
    let col = '<div class="row border"><div class="col-1">P<sub>' + (i + 1) + '</sub></div>'
    let progressBar = '<div class="col"><div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" id="P' + (i + 1) + '"style = "width: 0%" ></div></div></div></col></div>'
    placeHolder.innerHTML += col + progressBar;
  }

  // updating the bar
  // Step 1: Sort processes by arrival time
  const processes = processIds.map((id, index) => ({
    id: id,
    arrivalTime: arrivalTimes[index],
    burstTime: burstTimes[index],
    originalIndex: index,
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);
  let totalTime = 0; // Keeps track of total time elapsed

  for (let i = 0; i < n; i++) {
    const process = processes[i];
    const targetBar = document.getElementById("P" + (process.originalIndex + 1));
    const burstTime = process.burstTime;
    const intervalTime = 1000; // Adjust this value to control speed
    const totalSteps = burstTime; // The number of steps (updates) to complete the burst

    // Schedule the updates for this process
    for (let j = 0; j <= totalSteps; j++) {
      setTimeout(() => {
        const currentWidth = (j / totalSteps) * 100;
        targetBar.style.width = `${currentWidth}%`;
        targetBar.innerText = `${Math.round(currentWidth)}%`;
      }, totalTime + j * intervalTime);
    }

    // Update totalTime to start the next process after this one finishes
    totalTime += burstTime * intervalTime;
  }
}

function sjf(processIds, arrivalTimes, burstTimes) {
  const n = processIds.length;
  const completionTimes = new Array(n).fill(0);
  const turnaroundTimes = new Array(n).fill(0);
  const waitingTimes = new Array(n).fill(0);
  const isCompleted = new Array(n).fill(false);
  let avgTAT = 0;
  let avgWT = 0;

  let currentTime = 0;
  let completed = 0;

  // Process selection based on shortest job next
  while (completed != n) {
    let idx = -1;
    let minBurst = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
      if (arrivalTimes[i] <= currentTime && !isCompleted[i]) {
        if (burstTimes[i] < minBurst) {
          minBurst = burstTimes[i];
          idx = i;
        }
        if (burstTimes[i] == minBurst) {
          if (arrivalTimes[i] < arrivalTimes[idx]) {
            idx = i;
          }
        }
      }
    }

    if (idx != -1) {
      completionTimes[idx] = currentTime + burstTimes[idx];
      turnaroundTimes[idx] = completionTimes[idx] - arrivalTimes[idx];
      avgTAT += turnaroundTimes[idx];
      waitingTimes[idx] = turnaroundTimes[idx] - burstTimes[idx];
      avgWT += waitingTimes[idx];
      currentTime = completionTimes[idx];
      isCompleted[idx] = true;
      completed++;
    } else {
      currentTime++;
    }
  }

  // Generating HTML table
  let tableHTML = "<table class='table'><thead><tr><th scope='col'>Process No</th><th scope='col'>AT</th><th scope='col'>BT</th><th scope='col'>CT</th><th scope='col'>TAT</th><th scope='col'>WT</th></tr></thead>";

  for (let i = 0; i < n; i++) {
    tableHTML += `<tr>
      <td>${processIds[i]}</td>
      <td>${arrivalTimes[i]}</td>
      <td>${burstTimes[i]}</td>
      <td>${completionTimes[i]}</td>
      <td>${turnaroundTimes[i]}</td>
      <td>${waitingTimes[i]}</td>
    </tr>`;
  }

  tableHTML += "</table>";

  // heading
  document.getElementById("selectedAlgoHeading").innerText = "Shortest Job First"
  // Display the table in the HTML element
  document.getElementById("resultTable").innerHTML = tableHTML;
  // avgTAT & avgWT
  document.getElementById("showAVGTAT").innerText = "Average Turn-around Time: " + avgTAT;
  document.getElementById("showAVGWT").innerText = "Average Waiting Time: " + avgWT;

  // check simulation status
  const simulationStatus = document.getElementById("simulationStatus");
  // if (simulationStatus.)
  if (simulationStatus.checked) {
    sjfSimulator2(processIds, arrivalTimes, burstTimes);
  }
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sjfSimulator(processIds, arrivalTimes, burstTimes) {
  const n = processIds.length;
  let placeHolder = document.getElementById("progressContainer");

  // Creating the view with progress bars
  for (let i = 0; i < n; i++) {
    let col = '<div class="row border"><div class="col-1">P<sub>' + (i + 1) + '</sub></div>';
    let progressBar = '<div class="col"><div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" id="P' + (i + 1) + '" style="width: 0%"></div></div></div>';
    placeHolder.innerHTML += col + progressBar + '</div>';
  }

  // Sorting processes based on arrival time
  const processes = processIds.map((id, index) => ({
    id: id,
    arrivalTime: arrivalTimes[index],
    burstTime: burstTimes[index],
    originalIndex: index,
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let completed = 0;
  const isCompleted = new Array(n).fill(false);

  while (completed < n) {
    let idx = -1;
    let minBurstTime = Number.MAX_VALUE;

    // Find the process with the minimum burst time among the arrived processes
    for (let i = 0; i < n; i++) {
      if (processes[i].arrivalTime <= currentTime && !isCompleted[i]) {
        if (processes[i].burstTime < minBurstTime) {
          minBurstTime = processes[i].burstTime;
          idx = i;
        }
        if (processes[i].burstTime === minBurstTime) {
          if (processes[i].arrivalTime < processes[idx].arrivalTime) {
            idx = i;
          }
        }
      }
    }

    if (idx !== -1) {
      const process = processes[idx];
      let targetBar = document.getElementById("P" + (process.originalIndex + 1));
      const burstTime = process.burstTime;
      const intervalTime = 1000; // Adjust this value to control speed
      const totalSteps = burstTime;

      // Update the progress bar for the current process
      for (let j = 0; j <= totalSteps; j++) {
        setTimeout(() => {
          const currentWidth = (j / totalSteps) * 100;
          targetBar.style.width = `${currentWidth}%`;
          targetBar.innerText = `${Math.round(currentWidth)}%`;
        }, j * intervalTime);
      }

      // Wait for the current process to finish before starting the next
      await sleep(burstTime * intervalTime);

      // Update current time and mark the process as completed
      currentTime += burstTime;
      isCompleted[idx] = true;
      completed++;

    } else {
      // If no process is ready, move the current time forward
      currentTime++;
    }
  }
}

async function increaseBar(targetBar, burstTime, intervalTime) {
  const totalSteps = burstTime;
  let currentWidth = 0;

  for (let j = 0; j <= totalSteps; j++) {
    await new Promise((resolve) => {
      setTimeout(() => {
        currentWidth = (j / totalSteps) * 100;
        targetBar.style.width = `${currentWidth}%`;
        targetBar.innerText = `${Math.round(currentWidth)}%`;
        resolve();
      }, intervalTime); // wait for each interval before proceeding to the next step
    });
  }
}


async function sjfSimulator2(processIds, arrivalTimes, burstTimes) {
  const n = processIds.length;
  let placeHolder = document.getElementById("progressContainer");

  // Creating the view with progress bars
  for (let i = 0; i < n; i++) {
    let col = '<div class="row border"><div class="col-1">P<sub>' + (i + 1) + '</sub></div>';
    let progressBar = '<div class="col"><div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" id="P' + (i + 1) + '" style="width: 0%"></div></div></div>';
    placeHolder.innerHTML += col + progressBar + '</div>';
  }

  // Sorting processes based on arrival time
  const processes = processIds.map((id, index) => ({
    id: id,
    arrivalTime: arrivalTimes[index],
    burstTime: burstTimes[index],
    originalIndex: index,
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);

  let nextExecutionProcess = []
  let nextExecutionProcessId = []
  let completedProcess = []
  // let targetBar = document.getElementById("P1");
  let timePassed = processes[0].arrivalTime;
  while (completedProcess.length != n) {
    if (nextExecutionProcess.length == 0) {
      for (let i = 0; i < n; i++) {
        if (!completedProcess.includes(processes[i].id)) {
          nextExecutionProcess.push(processes[i]);
          nextExecutionProcessId.push(processes[i].id);
          break;
        }
      }
    }

    let targetBar = document.getElementById("P" + nextExecutionProcess[0].id);
    // increase the bar
    const totalSteps = nextExecutionProcess[0].burstTime;
    let currentWidth = 0;

    // await updateProgressBar(targetBar, totalSteps);
    // await increaseBar(targetBar, totalSteps, 1000);
    for (let j = 0; j <= totalSteps; j++) {
      setTimeout(() => {
        const currentWidth = (j / totalSteps) * 100;
        targetBar.style.width = `${currentWidth}%`;
        targetBar.innerText = `${Math.round(currentWidth)}%`;
      }, j * 1000);
    }

    // Wait for the current process to finish before starting the next
    await sleep(totalSteps * 1000);

    timePassed += nextExecutionProcess[0].burstTime;
    completedProcess.push(nextExecutionProcess[0].id);
    nextExecutionProcess.shift();
    nextExecutionProcessId.shift();

    let inQ = [];
    for (let i = 0; i < n; i++) {
      if (!completedProcess.includes(processes[i].id) && processes[i].arrivalTime <= timePassed && !nextExecutionProcessId.includes(processes[i].id)) {
        inQ.push(processes[i]);
      }
    }

    console.log("inq=", inQ, inQ.length);
    console.log("nep=", nextExecutionProcess, nextExecutionProcess.length);
    // Update the nextExecutionProcess with the sorted queue
    // nextExecutionProcess.push(...inQ);
    for (let i = 0; i < inQ.length; i++) {
      nextExecutionProcess.push(inQ[i]);
      nextExecutionProcessId.push(inQ[i].id);
    }
    // shorting the next execution queue
    nextExecutionProcess.sort((a, b) => a.burstTime - b.burstTime);
    // adding the ids to the nextExecutionProcessId
    nextExecutionProcessId = []
    for (let i = 0; i < nextExecutionProcess.length; i++) {
      nextExecutionProcessId.push(nextExecutionProcess[i].id);
    }
    console.log("nep=", nextExecutionProcess, nextExecutionProcess.length);
    console.log("cp=", completedProcess, completedProcess.length);
  }
}

