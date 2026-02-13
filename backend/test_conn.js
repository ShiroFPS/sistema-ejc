
import net from 'net';

const host = 'db.ckiqrlooleasaqgvwbqu.supabase.co';
const ports = [5432, 6543];

ports.forEach(port => {
    const socket = new net.Socket();
    console.log(`Testing connection to ${host}:${port}...`);

    const timeout = setTimeout(() => {
        console.log(`❌ Timeout connecting to ${host}:${port}`);
        socket.destroy();
    }, 5000);

    socket.connect(port, host, () => {
        console.log(`✅ Successfully connected to ${host}:${port}`);
        clearTimeout(timeout);
        socket.destroy();
    });

    socket.on('error', (err) => {
        console.log(`❌ Error connecting to ${host}:${port}:`, err.message);
        clearTimeout(timeout);
    });
});
