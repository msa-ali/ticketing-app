import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';

it('should return 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
})

it('should return ticket if ticket is found', async () => {
    const obj = {
        title: 'sdfffds',
        price: 20
    };
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send(obj)
        .expect(201);
    const ticketRes = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    expect(ticketRes.body.title).toEqual(obj.title);
    expect(ticketRes.body.price).toEqual(obj.price)
});