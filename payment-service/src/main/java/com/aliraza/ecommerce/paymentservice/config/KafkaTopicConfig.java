package com.aliraza.ecommerce.paymentservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic paymentCompletedTopic(
            @Value("${app.kafka.topics.payment-completed}") String topicName
    ) {
        return TopicBuilder.name(topicName)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentFailedTopic(
            @Value("${app.kafka.topics.payment-failed}") String topicName
    ) {
        return TopicBuilder.name(topicName)
                .partitions(1)
                .replicas(1)
                .build();
    }
}