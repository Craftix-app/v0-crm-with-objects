-- Checkpoint 5 Final Seed Script
-- Run this ONCE to seed all data

-- Step 1: Clear existing data (order matters for foreign keys)
TRUNCATE relationships CASCADE;
TRUNCATE records CASCADE;
TRUNCATE object_definitions CASCADE;
TRUNCATE relationship_definitions CASCADE;
TRUNCATE object_types CASCADE;

-- Step 2: Insert object_types (no id column, key is primary)
INSERT INTO object_types (key, label, description) VALUES
  ('entity', 'Entity', 'Represents a person, organization, or thing'),
  ('occurrence', 'Occurrence', 'An instance or event that happens'),
  ('event', 'Event', 'A scheduled or recorded happening'),
  ('activity', 'Activity', 'An action or series of actions'),
  ('task', 'Task', 'A unit of work to be completed'),
  ('document', 'Document', 'A written or digital record'),
  ('file', 'File', 'A stored digital asset'),
  ('metric', 'Metric', 'A quantitative measurement'),
  ('relationship', 'Relationship', 'A connection between objects');

-- Step 3: Insert relationship_definitions (no id column, key is primary)
INSERT INTO relationship_definitions (key, label, from_object_key, to_object_key, description) VALUES
  ('contact_company', 'Works At', 'contact', 'company', 'Contact is employed by company'),
  ('company_contact', 'Employs', 'company', 'contact', 'Company employs contact'),
  ('task_contact', 'Assigned To', 'task', 'contact', 'Task is assigned to contact'),
  ('task_company', 'Related To', 'task', 'company', 'Task is related to company'),
  ('document_contact', 'Associated With', 'document', 'contact', 'Document associated with contact'),
  ('document_company', 'Associated With', 'document', 'company', 'Document associated with company'),
  ('document_task', 'Attached To', 'document', 'task', 'Document attached to task');

-- Step 4: Insert object_definitions (needs user_id)
-- Using a placeholder user_id that will match RLS for anonymous/testing
INSERT INTO object_definitions (id, user_id, object_key, object_type_key, label, label_plural, enabled, properties_schema) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'contact', 'entity', 'Contact', 'Contacts', true, 
   '{"firstName": {"type": "text", "label": "First Name", "required": true}, "lastName": {"type": "text", "label": "Last Name", "required": true}, "email": {"type": "email", "label": "Email"}, "phone": {"type": "phone", "label": "Phone"}, "company": {"type": "text", "label": "Company"}, "jobTitle": {"type": "text", "label": "Job Title"}, "status": {"type": "select", "label": "Status", "options": ["lead", "active", "inactive"]}}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'company', 'entity', 'Company', 'Companies', true,
   '{"name": {"type": "text", "label": "Company Name", "required": true}, "industry": {"type": "text", "label": "Industry"}, "website": {"type": "url", "label": "Website"}, "phone": {"type": "phone", "label": "Phone"}, "address": {"type": "text", "label": "Address"}, "employees": {"type": "number", "label": "Employees"}, "revenue": {"type": "currency", "label": "Annual Revenue"}}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'task', 'task', 'Task', 'Tasks', true,
   '{"title": {"type": "text", "label": "Title", "required": true}, "description": {"type": "richText", "label": "Description"}, "status": {"type": "select", "label": "Status", "options": ["todo", "in_progress", "done"]}, "priority": {"type": "select", "label": "Priority", "options": ["low", "medium", "high"]}, "dueDate": {"type": "date", "label": "Due Date"}, "assignee": {"type": "text", "label": "Assignee"}}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'document', 'document', 'Document', 'Documents', true,
   '{"title": {"type": "text", "label": "Title", "required": true}, "content": {"type": "richText", "label": "Content"}, "type": {"type": "select", "label": "Type", "options": ["note", "proposal", "contract", "report"]}, "status": {"type": "select", "label": "Status", "options": ["draft", "review", "final"]}}'::jsonb);

-- Step 5: Insert records with fixed UUIDs so we can reference them in relationships
INSERT INTO records (id, user_id, object_key, title, properties) VALUES
  -- Contacts
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'contact', 'Alice Johnson', '{"firstName": "Alice", "lastName": "Johnson", "email": "alice@acme.com", "phone": "+1-555-0101", "company": "Acme Corp", "jobTitle": "CEO", "status": "active"}'::jsonb),
  ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000000', 'contact', 'Bob Smith', '{"firstName": "Bob", "lastName": "Smith", "email": "bob@globex.com", "phone": "+1-555-0102", "company": "Globex Inc", "jobTitle": "CTO", "status": "active"}'::jsonb),
  ('11111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000000', 'contact', 'Carol Williams', '{"firstName": "Carol", "lastName": "Williams", "email": "carol@initech.com", "phone": "+1-555-0103", "company": "Initech", "jobTitle": "VP Sales", "status": "lead"}'::jsonb),
  ('11111111-1111-1111-1111-111111111114', '00000000-0000-0000-0000-000000000000', 'contact', 'David Brown', '{"firstName": "David", "lastName": "Brown", "email": "david@acme.com", "phone": "+1-555-0104", "company": "Acme Corp", "jobTitle": "Engineer", "status": "active"}'::jsonb),
  ('11111111-1111-1111-1111-111111111115', '00000000-0000-0000-0000-000000000000', 'contact', 'Eve Davis', '{"firstName": "Eve", "lastName": "Davis", "email": "eve@globex.com", "phone": "+1-555-0105", "company": "Globex Inc", "jobTitle": "Designer", "status": "inactive"}'::jsonb),
  -- Companies
  ('22222222-2222-2222-2222-222222222221', '00000000-0000-0000-0000-000000000000', 'company', 'Acme Corp', '{"name": "Acme Corp", "industry": "Technology", "website": "https://acme.com", "phone": "+1-555-1000", "address": "123 Main St, San Francisco, CA", "employees": 500, "revenue": 50000000}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'company', 'Globex Inc', '{"name": "Globex Inc", "industry": "Manufacturing", "website": "https://globex.com", "phone": "+1-555-2000", "address": "456 Oak Ave, Austin, TX", "employees": 1200, "revenue": 120000000}'::jsonb),
  ('22222222-2222-2222-2222-222222222223', '00000000-0000-0000-0000-000000000000', 'company', 'Initech', '{"name": "Initech", "industry": "Consulting", "website": "https://initech.com", "phone": "+1-555-3000", "address": "789 Pine Rd, Seattle, WA", "employees": 75, "revenue": 8000000}'::jsonb),
  -- Tasks
  ('33333333-3333-3333-3333-333333333331', '00000000-0000-0000-0000-000000000000', 'task', 'Follow up with Alice', '{"title": "Follow up with Alice", "description": "Discuss Q4 partnership proposal", "status": "todo", "priority": "high", "dueDate": "2025-01-15", "assignee": "Sales Team"}'::jsonb),
  ('33333333-3333-3333-3333-333333333332', '00000000-0000-0000-0000-000000000000', 'task', 'Prepare Globex proposal', '{"title": "Prepare Globex proposal", "description": "Draft proposal for enterprise contract", "status": "in_progress", "priority": "high", "dueDate": "2025-01-10", "assignee": "Account Manager"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'task', 'Schedule demo call', '{"title": "Schedule demo call", "description": "Product demo for Carol at Initech", "status": "todo", "priority": "medium", "dueDate": "2025-01-20", "assignee": "Sales Team"}'::jsonb),
  ('33333333-3333-3333-3333-333333333334', '00000000-0000-0000-0000-000000000000', 'task', 'Send contract to Acme', '{"title": "Send contract to Acme", "description": "Final contract review and send", "status": "done", "priority": "high", "dueDate": "2024-12-20", "assignee": "Legal"}'::jsonb),
  ('33333333-3333-3333-3333-333333333335', '00000000-0000-0000-0000-000000000000', 'task', 'Update CRM records', '{"title": "Update CRM records", "description": "Clean up duplicate contacts", "status": "todo", "priority": "low", "dueDate": "2025-01-30", "assignee": "Operations"}'::jsonb),
  ('33333333-3333-3333-3333-333333333336', '00000000-0000-0000-0000-000000000000', 'task', 'Quarterly review prep', '{"title": "Quarterly review prep", "description": "Prepare slides for Q4 review", "status": "in_progress", "priority": "medium", "dueDate": "2025-01-05", "assignee": "Management"}'::jsonb),
  ('33333333-3333-3333-3333-333333333337', '00000000-0000-0000-0000-000000000000', 'task', 'Onboard new client', '{"title": "Onboard new client", "description": "Setup and training for Initech", "status": "todo", "priority": "high", "dueDate": "2025-02-01", "assignee": "Customer Success"}'::jsonb),
  ('33333333-3333-3333-3333-333333333338', '00000000-0000-0000-0000-000000000000', 'task', 'Review analytics', '{"title": "Review analytics", "description": "Monthly metrics review", "status": "done", "priority": "low", "dueDate": "2024-12-31", "assignee": "Analytics"}'::jsonb),
  -- Documents
  ('44444444-4444-4444-4444-444444444441', '00000000-0000-0000-0000-000000000000', 'document', 'Acme Partnership Proposal', '{"title": "Acme Partnership Proposal", "content": "Proposal for strategic partnership with Acme Corp...", "type": "proposal", "status": "final"}'::jsonb),
  ('44444444-4444-4444-4444-444444444442', '00000000-0000-0000-0000-000000000000', 'document', 'Globex Contract Draft', '{"title": "Globex Contract Draft", "content": "Enterprise service agreement terms...", "type": "contract", "status": "review"}'::jsonb),
  ('44444444-4444-4444-4444-444444444443', '00000000-0000-0000-0000-000000000000', 'document', 'Q4 Sales Report', '{"title": "Q4 Sales Report", "content": "Quarterly sales performance summary...", "type": "report", "status": "final"}'::jsonb),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'document', 'Meeting Notes - Initech', '{"title": "Meeting Notes - Initech", "content": "Discussion points from initial call...", "type": "note", "status": "final"}'::jsonb),
  ('44444444-4444-4444-4444-444444444445', '00000000-0000-0000-0000-000000000000', 'document', 'Product Roadmap 2025', '{"title": "Product Roadmap 2025", "content": "Planned features and releases...", "type": "report", "status": "draft"}'::jsonb);

-- Step 6: Insert relationships
INSERT INTO relationships (id, user_id, relationship_key, from_record_id, to_record_id) VALUES
  -- Contacts -> Companies
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'contact_company', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'contact_company', '11111111-1111-1111-1111-111111111114', '22222222-2222-2222-2222-222222222221'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'contact_company', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'contact_company', '11111111-1111-1111-1111-111111111115', '22222222-2222-2222-2222-222222222222'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'contact_company', '11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222223'),
  -- Tasks -> Contacts
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'task_contact', '33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'task_contact', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111113'),
  -- Tasks -> Companies
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'task_company', '33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'task_company', '33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222221'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'task_company', '33333333-3333-3333-3333-333333333337', '22222222-2222-2222-2222-222222222223'),
  -- Documents -> Companies
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'document_company', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222221'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'document_company', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'document_company', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222223'),
  -- Documents -> Tasks
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'document_task', '44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331');

-- Done! Verify counts:
SELECT 'object_types' as table_name, count(*) as count FROM object_types
UNION ALL SELECT 'relationship_definitions', count(*) FROM relationship_definitions
UNION ALL SELECT 'object_definitions', count(*) FROM object_definitions  
UNION ALL SELECT 'records', count(*) FROM records
UNION ALL SELECT 'relationships', count(*) FROM relationships;
