const icalHeader = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//github.com/grimsteel//Sunrise Sunset Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Sunrise Sunset Calendar`;

const icalFooter = `END:VCALENDAR`;

export class IcalBuilder {
  constructor() {
    this.events = [];
  }

  #serializeEvent({ timestamp, summary }, dstampTime) {
    const utcTimestamp = timestamp.toUTC();
    const dateString = utcTimestamp.toFormat("yyyyMMdd'T'HHmmss'Z'");
    const dstampString = dstampTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const uid = `${btoa(dateString)}@sunrise-sunset-calendar.grimsteel.github.io`;

    return `BEGIN:VEVENT
DTSTART:${dateString}
DTEND:${dateString}
DTSTAMP:${dstampString}
UID:${uid}
SUMMARY:${summary}
END:VEVENT`;
  }

  addEvent(event, dstampTime) {
    this.events.push(this.#serializeEvent(event, dstampTime));
    return this;
  }

  build() {
    return `${icalHeader}
${this.events.join("\n")}
${icalFooter}`;
  }
}
