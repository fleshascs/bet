// import amqp, { Channel } from 'amqplib';
// import { v4 as uuidv4 } from 'uuid';
// import EventEmitter from 'events';
import amqp from 'amqplib';

// https://github.com/Igor-lkm/node-rabbitmq-rpc-direct-reply-to

const RABBITMQ = process.env.RABBITMQ_URL || 'amqp://localhost';

const msg = { number: 1 };
connect();
async function connect() {
  try {
    const connection = await amqp.connect(RABBITMQ);
    const channel = await connection.createChannel();
    await channel.assertQueue('jobs');
    setInterval(async () => {
      await channel.sendToQueue('jobs', Buffer.from(JSON.stringify(msg)));
      console.log(`Job sent successfully ${msg.number}`);
    }, 3000);

    // await channel.close();
    // await connection.close();
  } catch (ex) {
    console.error(ex);
  }
}

// pseudo-queue for direct reply-to
// const REPLY_QUEUE = 'amq.rabbitmq.reply-to';
// const q = 'example';

// // Credits for Event Emitter goes to https://github.com/squaremo/amqp.node/issues/259

// type EventChannel = Channel & {
//   responseEmitter: EventEmitter;
// };

// const createClient = (rabbitmqconn: string) =>
//   amqp
//     .connect(rabbitmqconn)
//     .then((conn) => conn.createChannel())
//     .then((cnl) => {
//       const channel = cnl as EventChannel;
//       channel.responseEmitter = new EventEmitter();
//       channel.responseEmitter.setMaxListeners(0);
//       channel.consume(
//         REPLY_QUEUE,
//         (msg) => {
//           if (!msg) {
//             throw new Error('MESSAGE IS EMPTY');
//           }
//           channel.responseEmitter.emit(msg.properties.correlationId, msg.content.toString('utf8'));
//         },
//         { noAck: true }
//       );
//       return channel;
//     });

// const sendRPCMessage = (channel: EventChannel, message: string, rpcQueue: string) =>
//   new Promise((resolve) => {
//     const correlationId = uuidv4();
//     channel.responseEmitter.once(correlationId, resolve);
//     channel.sendToQueue(rpcQueue, Buffer.from(message), {
//       correlationId,
//       replyTo: REPLY_QUEUE
//     });
//   });

// export const init = async (): Promise<void> => {
//   const channel = await createClient(RABBITMQ);
//   const message = { uuid: uuidv4() };

//   setInterval(async () => {
//     console.log(`[ ${new Date()} ] Message sent: ${JSON.stringify(message)}`);
//     const respone = await sendRPCMessage(channel, JSON.stringify(message), q);
//     console.log(`[ ${new Date()} ] Message received: ${respone}`);
//   }, 3000);

//   // process.exit();
// };

// try {
//   init();
// } catch (e) {
//   console.log(e);
// }
