import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';

it('should return ticket a list of tickets', async () => {
    const obj = {
        title: 'sdfffds',
        price: 20
    };
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send(obj)
        .expect(201);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send(obj)
        .expect(201);
    const ticketRes = await request(app)
        .get(`/api/tickets`)
        .send()
        .expect(200);
    expect(ticketRes.body.length).toEqual(2);
});