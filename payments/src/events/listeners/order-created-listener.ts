import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketing-service-library/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue.group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, version, status, userId, ticket: { price } } = data;
        const order = Order.build({
            id,
            version,
            status,
            userId,
            price
        });
        await order.save();

        msg.ack();
    }

}