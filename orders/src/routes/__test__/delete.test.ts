import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { buildTicket } from './index.test';
import {OrderStatus} from '@ticketing-service-library/common';

it('cancels the order', async () => {
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

    
    // Make request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(order.id);

    // Make sure we only got the orders for User #2
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
})