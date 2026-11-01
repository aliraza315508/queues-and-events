CREATE TABLE payments (
                          id UUID PRIMARY KEY,
                          order_id VARCHAR(100) NOT NULL UNIQUE,
                          customer_id VARCHAR(100) NOT NULL,
                          amount NUMERIC(19, 2) NOT NULL,
                          payment_method VARCHAR(50) NOT NULL,
                          status VARCHAR(30) NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                          updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);