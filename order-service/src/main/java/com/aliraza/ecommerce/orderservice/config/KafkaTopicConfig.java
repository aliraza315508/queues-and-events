package com.aliraza.ecommerce.orderservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic orderCreatedTopic(
            @Value("${app.kafka.topics.order-created}") String topicName
    ) {
        return createTopic(topicName);
    }

    @Bean
    public NewTopic inventoryRejectedTopic(
            @Value("${app.kafka.topics.inventory-rejected}") String topicName
    ) {
        return createTopic(topicName);
    }

    @Bean
    public NewTopic paymentCompletedTopic(
            @Value("${app.kafka.topics.payment-completed}") String topicName
    ) {
        return createTopic(topicName);
    }

    @Bean
    public NewTopic paymentFailedTopic(
            @Value("${app.kafka.topics.payment-failed}") String topicName
    ) {
        return createTopic(topicName);
    }

    @Bean
    public NewTopic orderConfirmedTopic(
            @Value("${app.kafka.topics.order-confirmed}") String topicName
    ) {
        return createTopic(topicName);
    }

    @Bean
    public NewTopic orderCancelledTopic(
            @Value("${app.kafka.topics.order-cancelled}") String topicName
    ) {
        return createTopic(topicName);
    }

    private NewTopic createTopic(String topicName) {
        return TopicBuilder.name(topicName)
                .partitions(1)
                .replicas(1)
                .build();
    }
}
