import { Subjects, TicketCreatedEvent, Listener } from "@ticketing-service-library/common";

import { Message } from "node-nats-streaming";


class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data', data);
        console.log(data.id);
        console.log(data.title);
        console.log(data.price);
        msg.ack();
    }
}

export default TicketCreatedListener;