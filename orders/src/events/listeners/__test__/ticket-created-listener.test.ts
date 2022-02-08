import { TicketCreatedEvent } from "@ticketing-service-library/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: "concert",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };
    // create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return {listener, data, message}
};


it('creates and saves a ticket', async () => {
    const {data, listener, message} = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, message);
    // write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
})


it('acks the message', async () => {
    const {data, listener, message} = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, message);
    // write assertions to make sure ack function is called
    expect(message.ack).toHaveBeenCalled();
})