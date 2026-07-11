// Opens the resume in a new tab for viewing, and separately triggers a
// download with a clean, fixed filename regardless of the source file's
// actual name on disk.
export function openAndDownloadResume(url: string, downloadName: string) {
  if (!url) return;

  window.open(url, '_blank', 'noopener,noreferrer');

  const link = document.createElement('a');
  link.href = url;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
