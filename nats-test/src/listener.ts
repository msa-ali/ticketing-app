import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './events/ticket-created-listener';
try {
    const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
        url: 'http://localhost:4222'
    });
    // RUN kubectl port-forward nats-depl-657f975dcd-pznqg   4222:4222
    stan.on('connect', () => {
        console.log('Listener connected to NATS');

        stan.on('close', () => {
            console.log('NATS Connection Close');
            process.exit();
        })

        new TicketCreatedListener(stan).listen();
    });
    process.on('SIGINT', () => stan.close());
    process.on('SIGTERM', () => stan.close());
} catch (error) {
    console.error(error);
}






