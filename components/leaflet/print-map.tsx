import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { LatLngBounds, Layer } from 'leaflet';

interface PrintMapButtonProps {
  className?: string;
}

const PrintMapButton: React.FC<PrintMapButtonProps> = ({ className }) => {
  const map = useMap();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    try {
      setIsPrinting(true);

      // Get the map container
      const mapContainer = map.getContainer();

      // Store original map state
      const originalZoom = map.getZoom();
      const originalCenter = map.getCenter();

      // Center the map on the layers
      const layerBounds: LatLngBounds[] = [];

      map.eachLayer((layer: Layer) => {
        if ('getBounds' in layer && typeof layer.getBounds === 'function') {
          const bounds = layer.getBounds();
          if (bounds instanceof LatLngBounds) {
            layerBounds.push(bounds);
          }
        }
      });

      if (layerBounds.length > 0) {
        const bounds = new LatLngBounds(layerBounds[0].getSouthWest(), layerBounds[0].getNorthEast());
        layerBounds.forEach(layerBound => {
          bounds.extend(layerBound);
        });
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Temporarily hide UI elements
      const controls = mapContainer.querySelectorAll('.leaflet-control-container, button, .absolute');
      controls.forEach((control: Element) => {
        (control as HTMLElement).style.display = 'none';
      });

      // Wait for map animations and tile loading to complete
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Capture the map
      const canvas = await html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        scale: 2, // Higher quality
        width: mapContainer.offsetWidth,
        height: mapContainer.offsetHeight
      });

      // Restore original map state and UI elements
      map.setView(originalCenter, originalZoom);
      controls.forEach((control: Element) => {
        (control as HTMLElement).style.display = '';
      });

      // Create print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      // Write the print HTML
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Map Print</title>
            <style>
              @page {
                size: landscape;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: white;
              }
              img {
                max-width: 100%;
                max-height: calc(100vh - 40px);
                object-fit: contain;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
              @media print {
                body {
                  padding: 0;
                }
                img {
                  max-height: 100vh;
                  box-shadow: none;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL('image/png')}" />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

    } catch (error) {
      console.error('Error printing map:', error);
      alert('Failed to print map. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="icon"
      className={`h-8 w-8 ${className}`}
      onClick={handlePrint}
      disabled={isPrinting}
    >
      <Printer className="h-4 w-4" />
    </Button>
  );
};

export default PrintMapButton;