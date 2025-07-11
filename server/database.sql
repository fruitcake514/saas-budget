CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false
);

CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    budget_name VARCHAR(255) NOT NULL,
    owner_id INT REFERENCES users(user_id)
);

CREATE TABLE user_budgets (
    user_id INT REFERENCES users(user_id),
    budget_id INT REFERENCES budgets(budget_id),
    PRIMARY KEY (user_id, budget_id)
);

CREATE TABLE income (
    income_id SERIAL PRIMARY KEY,
    budget_id INT REFERENCES budgets(budget_id),
    amount DECIMAL(10, 2) NOT NULL,
    income_date DATE NOT NULL
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL, -- 50, 30, or 20
    is_predefined BOOLEAN DEFAULT true,
    user_id INT REFERENCES users(user_id) NULL -- Null for predefined categories
);

CREATE TABLE budget_items (
    budget_item_id SERIAL PRIMARY KEY,
    budget_id INT REFERENCES budgets(budget_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    allocated_amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    budget_id INT REFERENCES budgets(budget_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    budget_item_id INT REFERENCES budget_items(budget_item_id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    description VARCHAR(255)
);

-- Predefined Categories
INSERT INTO categories (category_name, percentage, is_predefined) VALUES
    ('Needs', 50, true),
    ('Wants', 30, true),
    ('Savings & Debt', 20, true);