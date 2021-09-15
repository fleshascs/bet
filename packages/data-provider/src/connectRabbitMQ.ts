import amqp from 'amqplib';
// import { v4 as uuidv4 } from 'uuid';

const RABBITMQ = process.env.RABBITMQ_URL || 'amqp://localhost';

setTimeout(() => {
  console.log('connect!!!!!!!!!!!!!!');

  connect();
}, 10000);

async function connect() {
  try {
    const connection = await amqp.connect(RABBITMQ);
    const channel = await connection.createChannel();
    await channel.assertQueue('jobs');

    channel.consume('jobs', (message) => {
      const input = JSON.parse(message.content.toString());
      console.log(`Recieved job with input ${input.number}`);
      //"7" == 7 true
      //"7" === 7 false

      if (input.number == 7) channel.ack(message);
    });

    console.log('Waiting for messages...');
  } catch (ex) {
    console.error(ex);
  }
}

// const open = amqp.connect(RABBITMQ);
// const q = 'example';

// // Consumer
// open
//   .then(function (conn) {
//     console.log(`[ ${new Date()} ] Server started`);
//     return conn.createChannel();
//   })
//   .then(function (ch) {
//     return ch.assertQueue(q).then(function (_ok) {
//       return ch.consume(q, function (msg) {
//         console.log(
//           `[ ${new Date()} ] Message received: ${JSON.stringify(
//             JSON.parse(msg.content.toString('utf8'))
//           )}`
//         );
//         if (msg !== null) {
//           const response = {
//             uuid: uuidv4()
//           };

//           console.log(`[ ${new Date()} ] Message sent: ${JSON.stringify(response)}`);

//           ch.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
//             correlationId: msg.properties.correlationId
//           });

//           ch.ack(msg);
//         }
//       });
//     });
//   })
//   .catch(console.warn);
