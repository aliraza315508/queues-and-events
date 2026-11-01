CREATE TABLE products (
                          id UUID PRIMARY KEY,
                          sku VARCHAR(100) NOT NULL UNIQUE,
                          name VARCHAR(150) NOT NULL,
                          description VARCHAR(500),
                          price NUMERIC(19, 2) NOT NULL,
                          active BOOLEAN NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                          updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);