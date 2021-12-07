import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing-service-library/common";



export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}