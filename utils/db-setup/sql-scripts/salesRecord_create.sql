-- Creating salesRecord and saleItems tables.
CREATE TABLE salesRecord (
  saleNumber SERIAL PRIMARY KEY,       
  saleDate DATE NOT NULL,              
  saleTime TIME NOT NULL,              
  totalPrice DECIMAL(10, 2) NOT NULL,  
  employeeID VARCHAR(10) NOT NULL,     
  source VARCHAR(50) NOT NULL          
);

CREATE TABLE saleItems (
  itemID SERIAL PRIMARY KEY,           
  saleNumber INTEGER REFERENCES salesRecord(saleNumber) ON DELETE CASCADE, 
  plateSize VARCHAR(50) NOT NULL,      
  itemName VARCHAR(100) NOT NULL       
);

-- Indexing the saleNumber column in saleItems 
CREATE INDEX idx_saleNumber ON saleItems(saleNumber);