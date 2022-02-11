import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketing-service-library/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}