CREATE TABLE customers (
                           id UUID PRIMARY KEY,
                           full_name VARCHAR(150) NOT NULL,
                           email VARCHAR(150) NOT NULL UNIQUE,
                           phone VARCHAR(30),
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                           updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at);