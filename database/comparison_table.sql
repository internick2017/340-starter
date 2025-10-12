-- Vehicle Comparison Feature Database Table
-- Add this to your database for the comparison functionality

CREATE TABLE IF NOT EXISTS vehicle_comparisons (
    comparison_id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    vehicle_ids INTEGER[] NOT NULL,
    comparison_name VARCHAR(100),
    comparison_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES account (account_id) ON DELETE SET NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_comparisons_session ON vehicle_comparisons(session_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_account ON vehicle_comparisons(account_id);