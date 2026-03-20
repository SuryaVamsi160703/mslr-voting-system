-- Create database
CREATE DATABASE IF NOT EXISTS suryadb;
USE suryadb;

-- Drop tables if they exist
DROP TABLE IF EXISTS voter_history;
DROP TABLE IF EXISTS referendum_options;
DROP TABLE IF EXISTS referendum;
DROP TABLE IF EXISTS scc_codes;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  email VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('VOTER', 'EC') NOT NULL DEFAULT 'VOTER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SCC codes table
CREATE TABLE scc_codes (
  code VARCHAR(20) PRIMARY KEY,
  is_used BOOLEAN DEFAULT FALSE,
  used_by_email VARCHAR(100),
  used_at TIMESTAMP NULL,
  FOREIGN KEY (used_by_email) REFERENCES users(email) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Referendum table
CREATE TABLE referendum (
  referendum_id INT PRIMARY KEY AUTO_INCREMENT,
  text TEXT NOT NULL,
  status ENUM('open', 'closed') NOT NULL DEFAULT 'closed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Referendum options table
CREATE TABLE referendum_options (
  opt_id INT PRIMARY KEY AUTO_INCREMENT,
  referendum_id INT NOT NULL,
  option_text TEXT NOT NULL,
  FOREIGN KEY (referendum_id) REFERENCES referendum(referendum_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Voter history table
CREATE TABLE voter_history (
  voter_email VARCHAR(100),
  referendum_id INT,
  voted_option_id INT NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (voter_email, referendum_id),
  FOREIGN KEY (voter_email) REFERENCES users(email) ON DELETE CASCADE,
  FOREIGN KEY (referendum_id) REFERENCES referendum(referendum_id) ON DELETE CASCADE,
  FOREIGN KEY (voted_option_id) REFERENCES referendum_options(opt_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin user (password: Shangrilavote&2025@)
-- This is the default password as specified in the coursework requirements
INSERT INTO users (email, name, dob, password_hash, role) VALUES 
('ec@referendum.gov.sr', 'Election Commission', '1990-01-01', '$2a$10$/pWYeown.HGK6dDSFLR4EuQ5zJA7DgS2M5ze3PmJyZRmouDHSyWoW', 'EC');

-- To change the password, run: node generate-admin-hash.js
-- Then update with: UPDATE users SET password_hash='NEW_HASH' WHERE email='ec@referendum.gov.sr';

-- Insert SCC codes
INSERT INTO scc_codes (code, is_used) VALUES
('1AZN0FXJVM', FALSE),
('JOV50TOSYR', FALSE),
('SDUBJ5IOYB', FALSE),
('YFUVLYBQZR', FALSE),
('IGBQET8OOY', FALSE),
('R2ZHBUYO2V', FALSE),
('Z9HOC1LF4X', FALSE),
('9IJKHGHJK4', FALSE),
('N5J53QK9FO', FALSE),
('ZDN06T01V9', FALSE),
('4XRDN9O4AW', FALSE),
('921664ML8D', FALSE),
('A546AKU16A', FALSE),
('V0GB2G690L', FALSE),
('12EOU5RGVX', FALSE),
('0IXYCAH8UW', FALSE),
('GKJ3K1YBGE', FALSE),
('46HJV9KH1F', FALSE),
('S6K3AV3IVR', FALSE),
('IKKSZYJTSH', FALSE);

-- Insert sample referendums
INSERT INTO referendum (text, status) VALUES
('Should Shangri-La pursue an expansion of its administrative boundaries to incorporate adjacent counties?', 'open'),
('Should Shangri-La prohibit cigarette sales?', 'closed');

-- Insert referendum options
INSERT INTO referendum_options (referendum_id, option_text) VALUES
(1, 'Expand its boundaries to include all adjacent counties'),
(1, 'Remain status quo'),
(2, 'Yes'),
(2, 'No');

-- Display success message
SELECT 'Database setup completed successfully!' AS Message;
