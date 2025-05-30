const bookingForm = document.getElementById('bookingForm');
const bookingList = document.getElementById('bookingList');
const statusMessage = document.getElementById('statusMessage');
const clearBtn = document.getElementById('clearBtn');

// Create room filter dropdown
const roomFilter = document.createElement('select');
roomFilter.innerHTML = `
  <option value="">-- Filter by Room --</option>
  <option value="Boardroom A">Boardroom A</option>
  <option value="Meeting Room 1">Meeting Room 1</option>
  <option value="Huddle Space">Huddle Space</option>
`;
roomFilter.style.marginTop = '10px';
roomFilter.style.padding = '10px';
document.querySelector('.bookings').insertBefore(roomFilter, bookingList);

// Load saved bookings
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

function displayBookings(filter = '') {
  bookingList.innerHTML = '';
  const filtered = filter ? bookings.filter(b => b.room === filter) : bookings;

  filtered.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
  filtered.forEach(addBookingToList);
  updateStatus(filtered.length ? 'Bookings loaded.' : 'No bookings yet.');
}

window.onload = () => displayBookings();

// Submit booking
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const room = document.getElementById('room').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!room || !date || !time) {
    return updateStatus('Please fill all fields.', 'red');
  }

  const now = new Date();
  const selected = new Date(date + 'T' + time);
  if (selected < now) {
    return updateStatus('Cannot book past time.', 'red');
  }

  const bookingKey = room + '_' + date + '_' + time;
  if (bookings.find(b => b.key === bookingKey)) {
    return updateStatus('Booking already exists.', 'red');
  }

  const booking = { room, date, time, key: bookingKey };
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  displayBookings(roomFilter.value);
  updateStatus(`Booked "${room}" for ${date} at ${time}.`);
  bookingForm.reset();
});

// Clear all bookings
clearBtn.addEventListener('click', () => {
  bookings = [];
  localStorage.removeItem('bookings');
  displayBookings();
  updateStatus('All bookings cleared.');
});

// Filter dropdown
roomFilter.addEventListener('change', () => {
  displayBookings(roomFilter.value);
});

// Add booking to list UI
function addBookingToList({ room, date, time, key }) {
  const li = document.createElement('li');
  li.textContent = `${room} → ${date} at ${time}`;

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.classList.add('cancel-btn');
  cancelBtn.onclick = () => {
    bookings = bookings.filter(b => b.key !== key);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    displayBookings(roomFilter.value);
    updateStatus('Booking canceled.');
  };

  li.appendChild(cancelBtn);
  bookingList.appendChild(li);
}

function updateStatus(message, color = '#4a2a99') {
  statusMessage.textContent = message;
  statusMessage.style.color = color;
  setTimeout(() => {
    statusMessage.textContent = '';
  }, 3000);
}
