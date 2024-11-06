INSERT INTO sales
    (
        sale_number,
        date_of_sale,
        employee_id,
        time_of_sale,
        price,
        franchise_id
    )
VALUES
    (
        (SELECT MAX(sale_number) + 1 FROM sales),
        $1,
        $2,
        $3,
        $4,
        1
    );