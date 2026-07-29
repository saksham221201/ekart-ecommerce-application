package com.saksham.orderservice.scheduler;

import com.saksham.orderservice.entity.Outbox;
import com.saksham.orderservice.publisher.MessagePublisher;
import com.saksham.orderservice.repository.OutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class PollerScheduler {
    private final OutboxRepository outboxRepository;
    private final MessagePublisher messagePublisher;

    @Scheduled(fixedDelay = 10000)
    public void pollAndProcessOrders() {
        List<Outbox> unProcessedOrders = outboxRepository.findByProcessedFalse();
        log.info("Found {} unprocessed orders to process.", unProcessedOrders.size());
        unProcessedOrders.forEach(outbox -> {
            try {
                messagePublisher.publishMessage(outbox.getPayload());
                outbox.setProcessed(true);
                outboxRepository.save(outbox);
            } catch (Exception e) {
                // Log the exception and continue processing other orders
                log.error("Failed to process order with ID: {}. Error: {}", outbox.getId(), e.getMessage());
            }
        });
    }
}
