CREATE TABLE notifications (
                               id UUID PRIMARY KEY,
                               order_id VARCHAR(100) NOT NULL,
                               customer_id VARCHAR(100) NOT NULL,
                               recipient_email VARCHAR(150) NOT NULL,
                               notification_type VARCHAR(50) NOT NULL,
                               subject VARCHAR(200) NOT NULL,
                               message VARCHAR(1000) NOT NULL,
                               status VARCHAR(30) NOT NULL,
                               created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                               updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_notifications_order_id ON notifications(order_id);

CREATE INDEX idx_notifications_customer_id ON notifications(customer_id);

CREATE INDEX idx_notifications_status ON notifications(status);

CREATE INDEX idx_notifications_notification_type ON notifications(notification_type);