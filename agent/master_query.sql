-- KISAN INTELLIGENCE — MASTER JOIN QUERY
-- Joins: Notion (farm portfolio) + Mandi (live prices) + Schemes (govt benefits)
-- Data sources: 3 | Glue code: 0 | ETL: None | Powered by Coral

SELECT 
  json_get_str(p.properties, 'farmer_name', 'rich_text', 0, 'plain_text') AS farmer_name,
  json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text')        AS crop,
  json_get_str(p.properties, 'district', 'select', 'name')                AS district,
  json_get_float(p.properties, 'land_acres', 'number')                    AS land_acres,
  m.market,
  m.modal_price,
  m.arrival_date,
  s.scheme_name,
  s.subsidy_amount,
  s.application_deadline
FROM notion.data_source_pages p
JOIN mandi.prices m
  ON m.commodity = json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text')
  AND m.state = 'Karnataka'
JOIN schemes.gov_schemes s
  ON s.state IN ('Karnataka', 'All')
WHERE p.data_source_id = '36c30c1b-5668-80bf-8284-000b52d4d5c1'
LIMIT 20