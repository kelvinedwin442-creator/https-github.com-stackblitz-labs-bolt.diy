/**
 * Exports the current SVG tactical pitch as a high-resolution PNG image
 */
export function exportPitchAsPng(
  svgElement: SVGSVGElement,
  title: string = 'tactical_drill',
  stepName: string = 'Step 1'
): void {
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      // High-res dimensions (2x scaling for retina quality)
      const scale = 2;
      canvas.width = 1600 * scale;
      canvas.height = 1000 * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark background fill
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header title bar on image
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`Tactical Coach — ${title}`, 60, 60);

      ctx.fillStyle = '#10b981';
      ctx.font = '600 24px monospace';
      ctx.fillText(stepName, 60, 100);

      // Draw SVG pitch
      const pitchX = 60;
      const pitchY = 120;
      const pitchW = canvas.width - 120;
      const pitchH = canvas.height - 180;
      ctx.drawImage(image, pitchX, pitchY, pitchW, pitchH);

      // Footer branding watermark
      ctx.fillStyle = '#64748b';
      ctx.font = '500 20px sans-serif';
      ctx.fillText('Created with Tactical Coach MVP', 60, canvas.height - 25);

      // Download trigger
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
      a.download = `${cleanTitle}_diagram.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  } catch (err) {
    console.error('Failed to export pitch as PNG:', err);
    alert('Could not generate PNG image from pitch.');
  }
}

/**
 * Direct download of the single-file offline HTML bundle
 */
export function downloadOfflineApp(): void {
  // Fetches tactical_coach_preview.html or serves the standalone bundle
  const a = document.createElement('a');
  a.href = '/tactical_coach_preview.html';
  a.download = 'Tactical_Coach_Offline_App.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
