import { getSunriseSunset } from "./sunrise-sunset.js";
import { DateTime } from "https://cdn.jsdelivr.net/npm/luxon@3.3.0/+esm";
import { IcalBuilder } from "./ical-export.js";
import { saveFile } from "./file-saver.js";

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

locationForm.addEventListener('submit', async e => {
  e.preventDefault();
  const isValidTimezone = validateTimezone(timezoneInput.value);
  if (!isValidTimezone) {
    timezoneInput.setCustomValidity('Invalid timezone');
    timezoneInput.reportValidity();
    return;
  }
  const currentDate = DateTime.local({ zone: timezoneInput.value }).startOf('day');
  const dstampTime = DateTime.now();
  const icalBuilder = new IcalBuilder();

  for (let i = 0; i < 365; i++) {
    const { sunrise, sunset } = getSunriseSunset(currentDate.plus({ days: i }), latitudeInput.value, longitudeInput.value);
    icalBuilder.addEvent({ timestamp: sunrise, summary: 'Sunrise' }, dstampTime);
    icalBuilder.addEvent({ timestamp: sunset, summary: 'Sunset' }, dstampTime);
  }
  
  const icalString = icalBuilder.build();
  await saveFile('sunrise-sunset.ics', icalString);
});

useCurrentLocation.addEventListener('click', async () => {
  timezoneInput.value = getCurrentTimezone();
  const { latitude, longitude } = await getCurrentLocation();
  latitudeInput.value = latitude;
  longitudeInput.value = longitude;
});

timezoneInput.addEventListener("change", () => timezoneInput.setCustomValidity(""));

if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("./service-worker.js");