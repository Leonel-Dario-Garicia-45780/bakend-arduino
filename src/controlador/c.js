
// import cron from 'node-cron';
import https from 'https';

let horaApagado = null;
let maquinaEncendida = false;
const esp32IpAddress = '192.168.1.100'; // Reemplaza con la IP de tu placa ESP32
const esp32Port = 80; // Reemplaza con el puerto de tu placa ESP32

// Controla la máquina: encender o apagar
export const controlarMaquina = async (req, res) => {
  const { command, hour, minute } = req.body;

  if (command === 'on') {
    maquinaEncendida = true;
    console.log('Máquina encendida');
    try {
      const options = {
        method: 'POST',
        hostname: esp32IpAddress,
        port: esp32Port,
        path: '/control',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log(`Respuesta de la placa ESP32: ${data}`);
          res.status(200).json({ status: 'success', command });
        });
      });

      req.write(JSON.stringify({ command: 'on' }));
      req.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error al enviar la orden a la placa ESP32' });
    }
    return; // Salir después de encender la máquina
  }

  if (command === 'off') {
    if (hour !== undefined && minute !== undefined) {
      // Programar apagado
      horaApagado = { hour: parseInt(hour), minute: parseInt(minute) };
      console.log(`Hora de apagado programada a las ${hour}:${minute}`);
      try {
        const options = {
          method: 'POST',
          hostname: esp32IpAddress,
          port: esp32Port,
          path: '/control',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log(`Respuesta de la placa ESP32: ${data}`);
            res.status(200).json({ status: 'success', command, message: `Hora de apagado programada a las ${hour}:${minute}` });
          });
        });

        req.write(JSON.stringify({ command: 'off_at', hour, minute }));
        req.end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al enviar la orden a la placa ESP32' });
      }
    } else {
      // Apagar inmediatamente
      maquinaEncendida = false;
      console.log('Máquina apagada');
      try {
        const options = {
          method: 'POST',
          hostname: esp32IpAddress,
          port: esp32Port,
          path: '/control',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log(`Respuesta de la placa ESP32: ${data}`);
            res.status(200).json({ status: 'success', command, message: 'Máquina apagada' });
          });
        });

        req.write(JSON.stringify({ command: 'off' }));
        req.end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al enviar la orden a la placa ESP32' });
      }
    }
    return; // Salir después de procesar el apagado
  }

  res.status(400).json({ status: 'error', message: 'Comando no reconocido' });
};

// Devuelve el estado actual de la máquina
export const estadoMaquina = (req, res) => {
  res.status(200).json({ maquinaEncendida, horaApagado });
};





//! un pqueño problemita con axios en render

// import cron from 'node-cron';
// import axios from 'axios';

// let horaApagado = null;
// let maquinaEncendida = false;
// const esp32IpAddress = '192.168.1.100'; // Reemplaza con la IP de tu placa ESP32
// const esp32Port = 80; // Reemplaza con el puerto de tu placa ESP32

// // Controla la máquina: encender o apagar
// export const controlarMaquina = async (req, res) => {
//   const { command, hour, minute } = req.body;

//   if (command === 'on') {
//     maquinaEncendida = true;
//     console.log('Máquina encendida');
//     try {
//       const response = await axios.post(`http://${esp32IpAddress}:${esp32Port}/control`, { command: 'on' });
//       res.status(200).json({ status: 'success', command });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ status: 'error', message: 'Error al enviar la orden a la placa ESP32' });
//     }
//     return; // Salir después de encender la máquina
//   }

//   if (command === 'off') {
//     if (hour !== undefined && minute !== undefined) {
//       // Programar apagado
//       horaApagado = { hour: parseInt(hour), minute: parseInt(minute) };
//       console.log(`Hora de apagado programada a las ${hour}:${minute}`);
//       try {
//         const response = await axios.post(`http://${esp32IpAddress}:${esp32Port}/control`, { command: 'off_at', hour, minute });
//         res.status(200).json({ status: 'success', command, message: `Hora de apagado programada a las ${hour}:${minute}` });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error al enviar la orden a la placa ESP32' });
//       }
//     } else {
//       // Apagar inmediatamente
//       maquinaEncendida = false;
//       console.log('Máquina apagada');
//       try {
//         const response = await axios.post(`http://${esp32IpAddress}:${esp32Port}/control`, { command: 'off' });
//         res.status(200).json({ status: 'success', command, message: 'Máquina apagada' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error al enviar la orden a la placa ESP32' });
//       }
//     }
//     return; // Salir después de procesar el apagado
//   }

//   res.status(400).json({ status: 'error', message: 'Comando no reconocido' });
// };

// // Devuelve el estado actual de la máquina
// export const estadoMaquina = (req, res) => {
//   res.status(200).json({ maquinaEncendida, horaApagado });
// };






























//! vercion 2 interaccion con fronen unicamente 
// import cron from 'node-cron';

// let horaApagado = null;
// let maquinaEncendida = false;

// // Controla la máquina: encender o apagar
// export const controlarMaquina = (req, res) => {
//   const { command, hour, minute } = req.body;

//   if (command === 'on') {
//     maquinaEncendida = true;
//     console.log('Máquina encendida');
//     res.status(200).json({ status: 'success', command });
//     return; // Salir después de encender la máquina
//   }

//   if (command === 'off') {
//     if (hour !== undefined && minute !== undefined) {
//       // Programar apagado
//       horaApagado = { hour: parseInt(hour), minute: parseInt(minute) };
//       console.log(`Hora de apagado programada a las ${hour}:${minute}`);
//       res.status(200).json({ status: 'success', command, message: `Hora de apagado programada a las ${hour}:${minute}` });
//     } else {
//       // Apagar inmediatamente
//       maquinaEncendida = false;
//       console.log('Máquina apagada');
//       res.status(200).json({ status: 'success', command, message: 'Máquina apagada' });
//     }
//     return; // Salir después de procesar el apagado
//   }

//   res.status(400).json({ status: 'error', message: 'Comando no reconocido' });
// };

// // Devuelve el estado actual de la máquina
// export const estadoMaquina = (req, res) => {
//   res.status(200).json({ maquinaEncendida, horaApagado });
// };

// // Tarea programada para verificar la hora de apagado
// cron.schedule('* * * * *', () => {
//   const now = new Date();
//   const currentHour = now.getHours();
//   const currentMinute = now.getMinutes();

//   if (horaApagado && horaApagado.hour === currentHour && horaApagado.minute === currentMinute) {
//     maquinaEncendida = false;
//     console.log(`Máquina apagada a la hora programada (${horaApagado.hour}:${horaApagado.minute})`);
//     res.json({message:'maquina apagada exitsosamente'})
//     horaApagado = null; // Restablecer la hora de apagado
//   }
// });






//! vercion 1 , tiene un error de logica
// import cron from 'node-cron';

// let horaApagado = null;
// let maquinaEncendida = false;

// // Controla la máquina: encender o apagar
// export const controlarMaquina = (req, res) => {
//   const { command, hour, minute } = req.body;

//   if (command === 'on') {
//     maquinaEncendida = true;
//     console.log('Máquina encendida');
//   } else if (command === 'off') {
//     maquinaEncendida = false;
//     console.log('Máquina apagada');
//   }

//   if (hour !== undefined && minute !== undefined) {
//     horaApagado = { hour: parseInt(hour), minute: parseInt(minute) };
//     console.log(`Hora de apagado programada a las ${hour}:${minute}`);
//   }

//   res.status(200).json({ status: 'success', command });
// };

// // Devuelve el estado actual de la máquina
// export const estadoMaquina = (req, res) => {
//   res.status(200).json({ maquinaEncendida, horaApagado });
// };

// // Tarea programada para verificar la hora de apagado
// cron.schedule('* * * * *', () => {
//   const now = new Date();
//   const currentHour = now.getHours();
//   const currentMinute = now.getMinutes();

//   if (horaApagado && horaApagado.hour === currentHour && horaApagado.minute === currentMinute) {
//     maquinaEncendida = false;
//     console.log('Máquina apagada a la hora programada');
//     horaApagado = null; // Restablecer la hora de apagado
//   }
// });
