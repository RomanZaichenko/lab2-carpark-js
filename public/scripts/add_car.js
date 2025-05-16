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
  try {
    const res = await fetch('/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Помилка в опрацюванні запиту');
    }

    alert(data.message || 'Авто додано');
    e.target.reset();
    loadCars();
  } catch (err) {
    alert(err.message);
  }
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
