import cron from 'node-cron';

let horaApagado = null;
let maquinaEncendida = false;

// Controla la máquina: encender o apagar
export const controlarMaquina = (req, res) => {
  const { command, hour, minute } = req.body;

  if (command === 'on') {
    maquinaEncendida = true;
    console.log('Máquina encendida');
    res.status(200).json({ status: 'success', command });
    return; // Salir después de encender la máquina
  }

  if (command === 'off') {
    if (hour !== undefined && minute !== undefined) {
      // Programar apagado
      horaApagado = { hour: parseInt(hour), minute: parseInt(minute) };
      console.log(`Hora de apagado programada a las ${hour}:${minute}`);
      res.status(200).json({ status: 'success', command, message: `Hora de apagado programada a las ${hour}:${minute}` });
    } else {
      // Apagar inmediatamente
      maquinaEncendida = false;
      console.log('Máquina apagada');
      res.status(200).json({ status: 'success', command, message: 'Máquina apagada' });
    }
    return; // Salir después de procesar el apagado
  }

  res.status(400).json({ status: 'error', message: 'Comando no reconocido' });
};

// Devuelve el estado actual de la máquina
export const estadoMaquina = (req, res) => {
  res.status(200).json({ maquinaEncendida, horaApagado });
};

// Tarea programada para verificar la hora de apagado
cron.schedule('* * * * *', () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (horaApagado && horaApagado.hour === currentHour && horaApagado.minute === currentMinute) {
    maquinaEncendida = false;
    console.log(`Máquina apagada a la hora programada (${horaApagado.hour}:${horaApagado.minute})`);
    res.json({message:'maquina apagada exitsosamente'})
    horaApagado = null; // Restablecer la hora de apagado
  }
});






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
