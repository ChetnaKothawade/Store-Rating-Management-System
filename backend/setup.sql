
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'owner'))
);

-- Stores table
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400),
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Ratings table
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(user_id, store_id)
);

-- ============================================================
-- Admin user (chetna@gmail.com / Chetna@123)
-- ============================================================
INSERT INTO users (name, email, password, address, role)
VALUES (
  'Chetna Administrator User',
  'chetna@gmail.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin Office, Main Building',
  'admin'
);


-- Sample store owner
INSERT INTO users (name, email, password, address, role)
VALUES (
  'Rajesh Kumar Store Owner',
  'rajesh@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '123 Market Street, Mumbai',
  'owner'
);

-- Sample normal user
INSERT INTO users (name, email, password, address, role)
VALUES (
  'Priya Sharma Normal User Account',
  'priya@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '456 Lake View, Pune',
  'user'
);

-- Sample stores
INSERT INTO stores (name, email, address, owner_id)
VALUES
  ('Rajesh General Store', 'rajeshstore@example.com', '123 Market Street, Mumbai', 2),
  ('City Supermart', 'citysupermart@example.com', '789 Central Ave, Delhi', NULL),
  ('Fresh Grocers', 'freshgrocers@example.com', '321 Green Lane, Bangalore', NULL);

-- Sample ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES (3, 1, 4);
INSERT INTO ratings (user_id, store_id, rating) VALUES (3, 2, 5);

