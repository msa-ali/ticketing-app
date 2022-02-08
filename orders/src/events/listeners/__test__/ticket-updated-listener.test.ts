import { TicketUpdatedEvent } from "@ticketing-service-library/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 10,
    })
    await ticket.save();
    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'updated-concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };
    // create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return {listener, data, message, ticket}
};


it('finds, updates and saves a ticket', async () => {
    const {data, listener, message} = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, message);
    // write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
    expect(ticket?.price).toEqual(data.price);
    expect(ticket?.version).toEqual(data.version);
});


it('acks the message', async () => {
    const {data, listener, message} = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, message);
    // write assertions to make sure ack function is called
    expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const {data, listener, message} = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, message);
    } catch (error) {
        expect(error).toBeDefined();
    }
    expect(message.ack).not.toHaveBeenCalled();
});

