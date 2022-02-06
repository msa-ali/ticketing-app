import { Publisher, OrderCancelledEvent, Subjects } from "@ticketing-service-library/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}