package com.aliraza.ecommerce.inventoryservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaRetryConfig {

    @Bean
    public CommonErrorHandler kafkaErrorHandler() {
        FixedBackOff fixedBackOff = new FixedBackOff(1000L, 2L);

        return new DefaultErrorHandler(fixedBackOff);
    }
}
