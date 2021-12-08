import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing-service-library/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}