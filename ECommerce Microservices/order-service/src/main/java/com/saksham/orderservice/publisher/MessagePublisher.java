package com.saksham.orderservice.publisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
@Slf4j
@RequiredArgsConstructor
public class MessagePublisher {
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${order.poller.topic-name}")
    private String topicName;

    public void publishMessage(String payload) {
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate
                .send(topicName, payload);
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to send message: {}", ex.getMessage());
            } else {
                log.info("Message sent successfully to topic: {}", topicName);
            }
        });
    }
}
