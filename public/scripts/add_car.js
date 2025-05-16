async function loadManufacturers(selectId) {
  const res = await fetch('/manufacturers');
  const data = await res.json();
  const select = document.getElementById(selectId);
  select.innerHTML = '<option disabled selected value="">Select Manufacturer</option>';
  data.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.manufacturer_id;
    opt.textContent = m.name;
    select.appendChild(opt);
  });
}

async function loadCars() {
  const res = await fetch('/cars');
  const cars = await res.json();
  const editSelect = document.getElementById('carSelect');
  const delSelect = document.getElementById('deleteCarSelect');
  editSelect.innerHTML = delSelect.innerHTML = '<option disabled selected value="">Select Car</option>';
  cars.forEach(car => {
    const option = new Option(`${car.model} (${car.year})`, car.car_id);
    editSelect.appendChild(option.cloneNode(true));
    delSelect.appendChild(option.cloneNode(true));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadManufacturers('manufacturerSelect');
  loadManufacturers('editManufacturer');
  loadCars();
});

document.getElementById('carForm').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const body = Object.fromEntries(formData);
  await fetch('/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  alert('Car added');
  e.target.reset();
  loadCars();
});

document.getElementById('editForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('carSelect').value;
  const body = {
    manufacturer_id: document.getElementById('editManufacturer').value,
    model: document.getElementById('editModel').value,
    fuel_consumption: document.getElementById('editFuel').value,
    kilometrage: document.getElementById('editKM').value,
    year: document.getElementById('editYear').value,
    fuel_capacity: document.getElementById('editCapacity').value,
  };
  await fetch(`/cars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  alert('Car updated');
  loadCars();
});

document.getElementById('deleteForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('deleteCarSelect').value;
  await fetch(`/cars/${id}`, { method: 'DELETE' });
  alert('Car deleted');
  loadCars();
});
