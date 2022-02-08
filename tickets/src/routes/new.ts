import { requireAuth, validateRequest } from '@ticketing-service-library/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
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
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than zero')
]);

router.post(
    '/api/tickets',
    requireAuth,
    bodyValidator(),
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser?.id as string,
        });
        await ticket.save();
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });
        res.status(201).send(ticket);
    });

export { router as createTicketRouter };