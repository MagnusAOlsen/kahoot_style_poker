// generate-qr.ts
import QRCode from 'qrcode';
import ip from 'ip';
import fs from 'fs';

/* const localIP = ip.address(); // e.g. 192.168.1.42 */
const localIP = '195.88.55.16';
const url = `http://${localIP}`;

const outputPath = '../../public/qr-code.png'; // Save in public so React can access it

QRCode.toFile(outputPath, url, {
  color: {
    dark: '#000',  // QR code color
    light: '#FFF'  // Background
  }
}, (err) => {
  if (err) return console.error('Failed to save QR code:', err);
});
