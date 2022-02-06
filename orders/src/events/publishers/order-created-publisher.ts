import { Publisher, OrderCreatedEvent, Subjects } from "@ticketing-service-library/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}