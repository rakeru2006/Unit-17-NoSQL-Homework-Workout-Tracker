let db;
// create a new db request for a "excercise" database.
const request = indexedDB.open("excercise", 1);

request.onupgradeneeded = function(event) {
   // create object store called "pending" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  // create a workout on the pending db with readwrite access
  const workout = db.workout(["pending"], "readwrite");

  // access your pending object store
  const store = workout.objectStore("pending");

  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  // open a workout on your pending db
  const workout = db.workout(["pending"], "readwrite");
  // access your pending object store
  const store = workout.objectStore("pending");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/workout/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a workout on your pending db
        const workout = db.workout(["pending"], "readwrite");

        // access your pending object store
        const store = workout.objectStore("pending");

        // clear all items in your store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
