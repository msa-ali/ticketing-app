import { Publisher, PaymentCreatedEvent, Subjects } from "@ticketing-service-library/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}