CREATE TABLE tb_user (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN,
    img_name VARCHAR(255)
);

CREATE TABLE tb_settings (
    id BIGINT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    business_img_name VARCHAR(255)
);

CREATE TABLE tb_client (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_normalized VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE tb_address (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT UNIQUE REFERENCES tb_client(id),
    street VARCHAR(255) NOT NULL,
    number VARCHAR(255) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    cep VARCHAR(255)
);

CREATE TABLE tb_phone (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES tb_client(id),
    number VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CELULAR', 'FIXO', 'WHATSAPP', 'OUTRO'))
);

CREATE TABLE tb_category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE tb_supplier (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE tb_product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT REFERENCES tb_category(id)
);

CREATE TABLE tb_product_supplier (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES tb_product(id),
    supplier_id BIGINT REFERENCES tb_supplier(id),
    cost_per_cubic_meter DOUBLE PRECISION NOT NULL,
    cost_for5cubic_meters DOUBLE PRECISION NOT NULL,
    ton_cost DOUBLE PRECISION NOT NULL,
    density DOUBLE PRECISION NOT NULL,
    observations VARCHAR(255)
);

CREATE TABLE tb_price (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES tb_category(id),
    m3volume INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL
);

CREATE TABLE tb_stock (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT UNIQUE REFERENCES tb_product(id),
    m3quantity DOUBLE PRECISION NOT NULL,
    ton_quantity DOUBLE PRECISION NOT NULL,
    density DOUBLE PRECISION,
    version BIGINT
);

CREATE TABLE tb_order_address (
    id BIGSERIAL PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(255) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    cep VARCHAR(255)
);

CREATE TABLE tb_order (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES tb_client(id),
    product_id BIGINT REFERENCES tb_product(id),
    address_id BIGINT NOT NULL UNIQUE REFERENCES tb_order_address(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('MATERIAL', 'SERVICE')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'DELIVERED')),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('PAID', 'PARTIAL', 'PENDING')),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    order_value NUMERIC(38,2) NOT NULL,
    remaining_value NUMERIC(38,2) NOT NULL,
    m3quantity DOUBLE PRECISION,
    ton_quantity DOUBLE PRECISION,
    service VARCHAR(255),
    observations VARCHAR(255)
);

CREATE TABLE tb_payment (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES tb_order(id),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('CASH', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'BANK_SLIP', 'CHECK')),
    payment_value NUMERIC(38,2) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE tb_expense (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('FIXED', 'VARIABLE', 'FUEL')),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('PAID', 'PARTIAL', 'PENDING')),
    expense_value NUMERIC(38,2) NOT NULL,
    date DATE NOT NULL,
    due_date DATE,
    payment_date DATE
);

CREATE TABLE tb_fixed_expense (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    default_value NUMERIC(38,2) NOT NULL
);

CREATE TABLE tb_fuel (
    id BIGSERIAL PRIMARY KEY,
    expense_id BIGINT UNIQUE REFERENCES tb_expense(id),
    vehicle VARCHAR(255),
    fuel_supplier VARCHAR(255),
    km_driven DOUBLE PRECISION,
    liters DOUBLE PRECISION,
    price_per_liter DOUBLE PRECISION
);
