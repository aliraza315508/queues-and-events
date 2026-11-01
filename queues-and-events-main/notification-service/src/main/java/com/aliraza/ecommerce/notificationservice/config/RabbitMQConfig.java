package com.aliraza.ecommerce.notificationservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;


@Configuration
@EnableRabbit
public class RabbitMQConfig {

    @Value("${app.rabbitmq.notification.queue}")
    private String notificationQueueName;

    @Value("${app.rabbitmq.notification.exchange}")
    private String notificationExchangeName;

    @Value("${app.rabbitmq.notification.routing-key}")
    private String notificationRoutingKey;


    @Value("${app.rabbitmq.notification.dlq}")
    private String notificationDlqName;

    @Value("${app.rabbitmq.notification.dlq-exchange}")
    private String notificationDlqExchangeName;

    @Value("${app.rabbitmq.notification.dlq-routing-key}")
    private String notificationDlqRoutingKey;

    @Bean
    public Queue notificationQueue()
    {
        return QueueBuilder
                .durable(notificationQueueName)
                .deadLetterExchange(notificationDlqExchangeName)
                .deadLetterRoutingKey(notificationDlqRoutingKey)
                .build();

    }

    @Bean
    public DirectExchange notificationExchange()
    {
        return new DirectExchange(notificationExchangeName);
    }

    @Bean
    public Binding notificationBinding(
         @Qualifier("notificationQueue") Queue notificationQueue,
         @Qualifier("notificationExchange")   DirectExchange notificationExchange
    ) {
        return BindingBuilder
                .bind(notificationQueue)
                .to(notificationExchange)
                .with(notificationRoutingKey);
    }

    @Bean
    Queue notificationDlq()
    {
        return QueueBuilder
                .durable(notificationDlqName)
                .build();
    }

    @Bean
    DirectExchange notificationDlqExchange(){
        return new DirectExchange(notificationDlqExchangeName);
    }

    @Bean
    public Binding notificationDlqBinding(
            @Qualifier("notificationDlq") Queue notificationDlq,
            @Qualifier("notificationDlqExchange") DirectExchange notificationDlqExchange
    ) {
        return BindingBuilder
                .bind(notificationDlq)
                .to(notificationDlqExchange)
                .with(notificationDlqRoutingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter()
    {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory,
            MessageConverter jsonMessageConverter
    ) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter);
        return rabbitTemplate;
    }
}