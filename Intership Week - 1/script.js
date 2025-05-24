const bookingForm = document.getElementById('bookingForm');
const bookingList = document.getElementById('bookingList');
const statusMessage = document.getElementById('statusMessage');
const clearBtn = document.getElementById('clearBtn');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const room = document.getElementById('room').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  // Validate inputs
  if (!room || !date || !time) {
    statusMessage.textContent = 'Please fill all fields.';
    statusMessage.style.color = 'red';
    return;
  }

  // Create new booking entry
  const li = document.createElement('li');
  li.textContent = `${room} → ${date} at ${time}`;

  // Create cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.classList.add('cancel-btn');
  cancelBtn.onclick = () => {
    bookingList.removeChild(li);
    updateStatus('Booking canceled.');
  };

  li.appendChild(cancelBtn);
  bookingList.appendChild(li);

  updateStatus(`Room "${room}" booked for ${date} at ${time}.`);

  // Reset form
  bookingForm.reset();
});

clearBtn.addEventListener('click', () => {
  bookingList.innerHTML = '';
  updateStatus('All bookings cleared.');
});

function updateStatus(message) {
  statusMessage.textContent = message;
  statusMessage.style.color = '#4a2a99';
}
