import { requireAuth, validateRequest } from '@ticketing-service-library/common';
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import { Ticket } from '../models/ticket';

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

router.post(
    '/api/tickets', 
    requireAuth, 
    bodyValidator(), 
    validateRequest, 
    async (req: Request, res: Response) => {
    const {title, price} = req.body;
    const ticket = Ticket.build({
        title, 
        price,
        userId: req.currentUser?.id as string,
    });
    await ticket.save();

    res.status(201).send(ticket);
});

export  {router as createTicketRouter};