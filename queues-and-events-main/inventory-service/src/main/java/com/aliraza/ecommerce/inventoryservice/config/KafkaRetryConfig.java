package com.aliraza.ecommerce.inventoryservice.config;

import org.apache.kafka.common.TopicPartition;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaRetryConfig {

    @Bean
    public CommonErrorHandler kafkaErrorHandler(
            KafkaTemplate<Object , Object> kafkaTemplate ,
            @Value("${app.kafka.topics.inventory-dlt}")
            String inventoryDltTopic

    ) {
        DeadLetterPublishingRecoverer recoverer =
                new DeadLetterPublishingRecoverer(kafkaTemplate
                , (record , exception ) ->
                        new TopicPartition( inventoryDltTopic , record.partition())
                );


        FixedBackOff fixedBackOff = new FixedBackOff(1000L, 2L);

        return new DefaultErrorHandler( recoverer , fixedBackOff );
    }
}
