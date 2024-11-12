CREATE TABLE inventory (
        inventory_id INTEGER PRIMARY KEY,
        item_name TEXT NOT NULL,
        item_type TEXT NOT NULL,
        ingredients TEXT,
        curr_amount INTEGER NOT NULL,
        needed4Week INTEGER NOT NULL,
        needed4GameWeek INTEGER NOT NULL
    );
