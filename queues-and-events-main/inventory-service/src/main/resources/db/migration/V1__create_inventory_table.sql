CREATE TABLE inventory (
                           id UUID PRIMARY KEY,
                           product_id VARCHAR(100) NOT NULL UNIQUE,
                           available_quantity INTEGER NOT NULL,
                           reserved_quantity INTEGER NOT NULL,
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                           updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);