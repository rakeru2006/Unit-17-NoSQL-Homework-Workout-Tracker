let workouts = [];
let myChart;

fetch('/api/workout')
  .then((response) => response.json())
  .then((data) => {
    // save db data on global variable
    workouts = data;
    populateTotal();
    populateTable();
    populateChart();
  });

function populateTotal() {
  // reduce workout amounts to a single total value
  const total = workouts
    .reduce((total, t) => {
      return total + parseFloat(t.value);
    }, 0)
    .toFixed(2);

  const totalEl = document.querySelector('#total');
  totalEl.textContent = total;
}

function populateTable() {
  const tbody = document.querySelector('#tbody');
  tbody.innerHTML = '';

  workouts.forEach((workout) => {
    // create and populate a table row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${workout.name}</td>
      <td>${workout.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

function populateChart() {
  // copy array and reverse it
  const reversed = workouts.slice().reverse();
  let sum = 0;

  // create date labels for chart
  const labels = reversed.map((t) => {
    const date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  const data = reversed.map((t) => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  const ctx = document.getElementById('my-chart').getContext('2d');

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Over Time',
          fill: true,
          backgroundColor: '#6666ff',
          data,
        },
      ],
    },
  });
}

function sendworkout(isAdding) {
  const nameEl = document.querySelector('#t-name');
  const amountEl = document.querySelector('#t-Quantity');
  const errorEl = document.querySelector('form .error');

  // validate form
  if (nameEl.value === '' || amountEl.value === '') {
    errorEl.textContent = 'Missing Information';
    return;
  } else {
    errorEl.textContent = '';
  }

  // create record
  const workout = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString(),
  };

  // if subtracting excerciseRoutine, convert Quantity to negative number
  if (!isAdding) {
    workout.value *= -1;
  }

  // add to beginning of current array of data
  workouts.unshift(workout);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();

  // also send to server
  fetch('/api/workout', {
    method: 'POST',
    body: JSON.stringify(workout),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        errorEl.textContent = 'Missing Information';
      } else {
        // clear form
        nameEl.value = '';
        amountEl.value = '';
      }
    })
    .catch((err) => {
      // fetch failed, so save in indexed db
      saveRecord(workout);

      // clear form
      nameEl.value = '';
      amountEl.value = '';
    });
}

document.querySelector('#add-btn').addEventListener('click', function (event) {
  event.preventDefault();
  sendworkout(true);
});

document.querySelector('#sub-btn').addEventListener('click', function (event) {
  event.preventDefault();
  sendworkout(false);
});
