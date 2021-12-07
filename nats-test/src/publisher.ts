import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});
// RUN kubectl port-forward nats-depl-657f975dcd-pznqg   4222:4222
stan.on('connect', async () => {
    console.log('Publisher Connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '1',
            title: 'concert',
            price: 20,
        });
    } catch (error) {
        console.error(error);
    }
});