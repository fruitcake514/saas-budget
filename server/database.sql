CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT 0
);

CREATE TABLE budgets (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_name TEXT NOT NULL,
    owner_id INTEGER REFERENCES users(user_id)
);

CREATE TABLE user_budgets (
    user_id INTEGER REFERENCES users(user_id),
    budget_id INTEGER REFERENCES budgets(budget_id),
    PRIMARY KEY (user_id, budget_id)
);

CREATE TABLE income (
    income_id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_id INTEGER REFERENCES budgets(budget_id),
    amount REAL NOT NULL,
    income_date TEXT NOT NULL
);

CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL,
    percentage REAL NOT NULL, -- 50, 30, or 20
    is_predefined BOOLEAN DEFAULT 1,
    user_id INTEGER REFERENCES users(user_id) NULL -- Null for predefined categories
);

CREATE TABLE budget_items (
    budget_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_id INTEGER REFERENCES budgets(budget_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    allocated_amount REAL NOT NULL
);

CREATE TABLE expenses (
    expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_id INTEGER REFERENCES budgets(budget_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
    budget_item_id INTEGER REFERENCES budget_items(budget_item_id) ON DELETE SET NULL,
    amount REAL NOT NULL,
    expense_date TEXT NOT NULL,
    description TEXT
);

-- Predefined Categories
INSERT INTO categories (category_name, percentage, is_predefined) VALUES
    ('Needs', 50, 1),
    ('Wants', 30, 1),
    ('Savings & Debt', 20, 1);