const zenith = 90.833;
const minsInDay = 24 * 60;
const oneDay = 24 * 60 * 60 * 1000;

const deg = rad => rad * 180 / Math.PI;
const rad = deg => deg * Math.PI / 180;

/**
 * @param {any} dayStart The start of the day, according to the timezone offset the user chose
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} timezone
 */
export function getSunriseSunset(dayStart, latitude, longitude) {
  // See README.md for resources to find the explanation of the following code. (I don't understand it!)
  const midday = dayStart.set({ hours: 12 });
  const julianDay = midday.toMillis() / 86400000 + 2440587.5;
  const julianCentury = (julianDay - 2451545) / 36525;
  const geomMeanLongSun = (280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032)) % 360;
  const geomMeanAnomSun = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);
  const eccentEarthOrbit = 0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);
  const sunEqOfCtr = Math.sin(rad(geomMeanAnomSun)) * (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury )) + Math.sin(rad(2 * geomMeanAnomSun)) * (0.019993 - 0.000101 * julianCentury) + Math.sin(rad(3 * geomMeanAnomSun)) * 0.000289;
  const sunTrueLong = geomMeanLongSun + sunEqOfCtr;
  const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(rad(125.04 - 1934.136 * julianCentury));
  const meanOblicEcliptic = 23 + (26 + ((21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813)))) / 60) / 60;
  const obliqCorr = meanOblicEcliptic + 0.00256 * Math.cos(rad(125.04 - 1934.136 * julianCentury));
  const sunDeclin = deg(Math.asin(Math.sin(rad(obliqCorr)) * Math.sin(rad(sunAppLong))))
  const varY = Math.tan(rad(obliqCorr / 2)) ** 2;
  const eqTime = 4 * deg(varY * Math.sin(2 * rad(geomMeanLongSun)) - 2 * eccentEarthOrbit * Math.sin(rad(geomMeanAnomSun)) + 4 * eccentEarthOrbit * varY * Math.sin(rad(geomMeanAnomSun)) * Math.cos(2 * rad(geomMeanLongSun)) - 0.5 * (varY ** 2) * Math.sin(4 * rad(geomMeanLongSun)) - 1.25 * (eccentEarthOrbit ** 2) * Math.sin(2 * rad(geomMeanAnomSun)));
  const hourAngleSunrise = deg(Math.acos(Math.cos(rad(zenith)) / (Math.cos(rad(latitude)) * Math.cos(rad(sunDeclin))) - Math.tan(rad(latitude)) * Math.tan(rad(sunDeclin))));
  const solarNoon = 720 - 4 * longitude - eqTime + midday.offset; // in minutes
  const sunrise = (solarNoon - hourAngleSunrise * 4) / minsInDay;
  const sunset = (solarNoon + hourAngleSunrise * 4) / minsInDay;
  const sunriseDate = dayStart.set({ milliseconds: sunrise * oneDay });
  const sunsetDate = dayStart.set({ milliseconds: sunset * oneDay });
  return { sunrise: sunriseDate, sunset: sunsetDate };
}