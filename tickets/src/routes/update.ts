import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@ticketing-service-library/common';
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const bodyValidator = () => ([
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({gt: 0})
        .withMessage('Price must be greater than zero')
]);

router.put(
    '/api/tickets/:id', 
    requireAuth, 
    bodyValidator(), 
    validateRequest, 
    async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }
    if(ticket.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    })

    res.send(ticket);
});

export  {router as updateTicketRouter};