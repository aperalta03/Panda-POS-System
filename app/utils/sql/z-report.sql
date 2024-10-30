-- z_report.sql
INSERT INTO daily_sales_totals (sales_date, total_sales, total_orders)
VALUES ($1, $2, $3);