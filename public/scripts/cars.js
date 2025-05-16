fetch('/cars')
  .then(res => res.json())
  .then(cars => {
    const tbody = document.querySelector('#carTable tbody');
    tbody.innerHTML = '';
    cars.forEach(car => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${car.manufacturer}</td>
        <td>${car.model}</td>
        <td>${car.fuel_consumption}</td>
        <td>${car.kilometrage}</td>
        <td>${car.year}</td>
        <td>${car.fuel_capacity}</td>
      `;
      tbody.appendChild(row);
    });
  });
