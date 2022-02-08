import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
    // @ts-ignore
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    return ticket;
}

it('fetches the order', async () => {
    // Create three tickets
    const ticket = await buildTicket();

    // Create user
    const user = global.signin();

    // Create one order as User #1
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    
    // Make request to get orders for User #2
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(fetchedOrder.id).toEqual(order.id);
})