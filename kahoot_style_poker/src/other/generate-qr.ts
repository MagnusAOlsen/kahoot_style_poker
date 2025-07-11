import QRCode from 'qrcode';
import ip from 'ip';

const localIP = ip.address();
const port = 5173;
const url = `http://${localIP}:${port}/PlayerLogin`;

const outputPath = '../../public/qr-code.png'; // Save in public so React can access it

QRCode.toFile(outputPath, url, {
  color: {
    dark: '#000',  // QR code color
    light: '#FFF'  // Background
  }
}, (err) => {
  if (err) return console.error('Failed to save QR code:', err);
});