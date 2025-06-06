document.getElementById('bookingForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = {
    name: document.querySelector('#name').value.trim(),
    email: document.querySelector('#email').value.trim(),
    date: document.querySelector('#date').value,
    time: document.querySelector('#time').value,
    room: document.querySelector('#room').value,
  };

  console.log('Sending booking data:', formData);

  fetch('/api/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
      alert(data.message || 'Booking submitted successfully!');

      document.getElementById('bookingForm').reset();

      const confirm = document.getElementById('confirmation');
      confirm.style.display = 'block';

      setTimeout(() => {
        confirm.style.display = 'none';
      }, 5000);
    })
    .catch(error => {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please try again.');
    });
});
