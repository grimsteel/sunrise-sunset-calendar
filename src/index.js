const locationForm = document.querySelector('#location-form');
const latitudeInput = document.querySelector('#latitude');
const longitudeInput = document.querySelector('#longitude');
const timezoneInput = document.querySelector('#timezone');
const useCurrentLocation = document.querySelector('#use-current-location');

async function getCurrentLocation() {
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
}

function validateTimezone(timezone) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

function getCurrentTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

locationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const isValidTimezone = validateTimezone(timezoneInput.value);
  if (!isValidTimezone) {
    timezoneInput.setCustomValidity('Invalid timezone');
    timezoneInput.reportValidity();
    return;
  }
});

useCurrentLocation.addEventListener('click', async () => {
  timezoneInput.value = getCurrentTimezone();
  const { latitude, longitude } = await getCurrentLocation();
  latitudeInput.value = latitude;
  longitudeInput.value = longitude;
});

timezoneInput.addEventListener("change", () => timezoneInput.setCustomValidity(""));