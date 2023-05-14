export async function saveFile(filename, content) {
  // If the File System Access API is available, use it.
  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({
      types: [{
        description: 'iCalendar file',
        accept: {
          'text/calendar': ['.ics']
        }
      }]
    });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    return;
  } else {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000 * 60);
  }
}