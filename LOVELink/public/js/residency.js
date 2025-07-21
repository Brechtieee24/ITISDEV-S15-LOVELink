document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('residency-history-btn');
  const modal = document.getElementById('residency-history-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeModalBtn = document.querySelector('.close-modal-btn');
  const tableBody = document.getElementById('modal-table-body');

  async function fetchResidencyHistory() {
    try {
      const res = await fetch('/api/residency-history');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      console.log("Data from backend:", data);
      
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">No residency history found.</td></tr>`;
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
          tableBody.innerHTML += row;
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  btn.onclick = async () => {
    await fetchResidencyHistory();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  closeModalBtn.onclick = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  overlay.onclick = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
});
