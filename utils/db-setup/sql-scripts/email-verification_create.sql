CREATE TABLE email_verification (
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  PRIMARY KEY (email),
  UNIQUE (email)
);