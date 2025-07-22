document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');

  // residency modal
  const residencyBtn = document.getElementById('residency-history-btn');
  const residencyModal = document.getElementById('residency-history-modal');
  const residencyTableBody = document.getElementById('modal-table-body');

  async function fetchResidencyHistory() {
    try {
      const res = await fetch('/api/residency-history');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      residencyTableBody.innerHTML = '';
      if (data.length === 0) {
        residencyTableBody.innerHTML = `<tr><td colspan="4">No residency history found.</td></tr>`;
      } else {
        data.forEach(record => {
          const row = `
            <tr>
              <td>${record.date}</td>
              <td>${record.timeIn}</td>
              <td>${record.timeOut}</td>
              <td>${record.total}</td>
            </tr>
          `;
          residencyTableBody.innerHTML += row;
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  residencyBtn.onclick = async () => {
    await fetchResidencyHistory();
    residencyModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  // activity modal
  const activityBtn = document.getElementById('activity-history-btn');
  const activityModal = document.getElementById('activity-history-modal');
  const activityTableBody = document.getElementById('activity-modal-table-body');

  async function fetchActivityHistory() {
    try {
      const res = await fetch('/api/activity-history');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      activityTableBody.innerHTML = '';
      if (data.length === 0) {
        activityTableBody.innerHTML = `<tr><td colspan="3">No activity history found.</td></tr>`;
      } else {
        data.forEach(record => {
          const row = `
            <tr>
              <td>${record.name}</td>
              <td>${record.date}</td>
              <td>${record.hours}</td>
            </tr>
          `;
          activityTableBody.innerHTML += row;
        });
      }
    } catch (err) {
      console.error('Failed to fetch activity history:', err);
    }
  }

  activityBtn.onclick = async () => {
    await fetchActivityHistory();
    activityModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  // close
  const closeButtons = document.querySelectorAll('.close-modal-btn');
  const modals = document.querySelectorAll('.modal');

  closeButtons.forEach((btn) => {
    btn.onclick = () => {
      modals.forEach((m) => m.classList.add('hidden'));
      overlay.classList.add('hidden');
    };
  });

  overlay.onclick = () => {
    modals.forEach((m) => m.classList.add('hidden'));
    overlay.classList.add('hidden');
  };
});
