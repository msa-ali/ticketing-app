import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('should return 404 if the provided id doesnt exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'fjdj',
            price: 20
        })
        .expect(404);
});

it('should return 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'fjdj',
            price: 20
        })
        .expect(401);
});

it('should return 401 if user doesnt own ticket', async () => {
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ddsd',
            price: 20,
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'ddsd-updated',
            price: 201,
        })
        .expect(401);
});

it('returns 400 if user provides invalid title or price', async () => {
    const cookie = global.signin();
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ddsd',
            price: 20,
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 201,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'ddd',
            price: -201,
        })
        .expect(400);
});

it('should update ticket if valid params are provided', async () => {
    const cookie = global.signin();
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ddsd',
            price: 20,
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'changed',
            price: 200,
        })
        .expect(200);

    const ticket = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()
    expect(ticket.body.title).toEqual('changed');
    expect(ticket.body.price).toEqual(200)


});

it('should publish an event', async () => {
    const cookie = global.signin();
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ddsd',
            price: 20,
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'changed',
            price: 200,
        })
        .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});