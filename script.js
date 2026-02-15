// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Load attendance from localStorage on page load
function loadAttendance() {
  const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  count = attendance.length;

  // Update total count
  document.getElementById("attendeeCount").textContent = count;

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100);
  document.getElementById("progressBar").style.width = percentage + "%";

  // Count teams
  let waterCount = 0;
  let zeroCount = 0;
  let powerCount = 0;

  for (let i = 0; i < attendance.length; i++) {
    const record = attendance[i];
    if (record.team === "water") {
      waterCount++;
    } else if (record.team === "zero") {
      zeroCount++;
    } else if (record.team === "power") {
      powerCount++;
    }
  }

  // Update team counters
  document.getElementById("waterCount").textContent = waterCount;
  document.getElementById("zeroCount").textContent = zeroCount;
  document.getElementById("powerCount").textContent = powerCount;
}

// Load attendance when page loads
loadAttendance();

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name + " " + teamName);

  // Increment count
  count++;
  document.getElementById("attendeeCount").textContent = count;

  // Store attendance in localStorage
  const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  attendance.push({ name, team });
  localStorage.setItem("attendance", JSON.stringify(attendance));

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100);
  document.getElementById("progressBar").style.width = percentage + "%";

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Show welcome message
  const feedback = document.getElementById("checkInFeedback");
  switch (team) {
    case "water":
      feedback.textContent = `🌊`;
      break;
    case "zero":
      feedback.textContent = `🌿`;
      break;
    case "power":
      feedback.textContent = `⚡`;
      break;
  }
  feedback.textContent += ` Welcome, ${name} from ${teamName}!`;
  feedback.style.display = "block";
  document.getElementsByClassName("team-stats")[0].style.marginTop = "8px";

  form.reset();

  if (count === maxCount) {
    const waterCard = document.getElementsByClassName("team-card water")[0];
    const zeroCard = document.getElementsByClassName("team-card zero")[0];
    const powerCard = document.getElementsByClassName("team-card power")[0];

    const waterCount = parseInt(
      waterCard.querySelector(".team-count").textContent,
    );
    const zeroCount = parseInt(
      zeroCard.querySelector(".team-count").textContent,
    );
    const powerCount = parseInt(
      powerCard.querySelector(".team-count").textContent,
    );

    const winCount = Math.max(waterCount, zeroCount, powerCount);
    let winningTeam = "";

    if (winCount === waterCount) {
      winningTeam += waterCard.querySelector(".team-name").textContent;
    }
    if (winCount === zeroCount) {
      winningTeam +=
        (winningTeam ? " & " : "") +
        zeroCard.querySelector(".team-name").textContent;
    }
    if (winCount === powerCount) {
      winningTeam +=
        (winningTeam ? " & " : "") +
        powerCard.querySelector(".team-name").textContent;
    }

    document.getElementById("winningTeam").textContent = winningTeam;
    document.querySelector(".winner-message").style.display = "block";
  }
});
