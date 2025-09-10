-- Clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM "user";
-- DELETE FROM "team";

-- Seed Teams (using INSERT ... ON CONFLICT to avoid duplicates)
INSERT INTO "team" ("id", "name") VALUES 
('11111111-1111-1111-1111-111111111111', 'Design'),
('22222222-2222-2222-2222-222222222222', 'Procurement'),
('33333333-3333-3333-3333-333333333333', 'CRM'),
('44444444-4444-4444-4444-444444444444', 'MIS'),
('55555555-5555-5555-5555-555555555555', 'HR'),
('66666666-6666-6666-6666-666666666666', 'Accounts'),
('77777777-7777-7777-7777-777777777777', 'AI')
ON CONFLICT ("id") DO NOTHING;

-- Directors (Super Admins)
INSERT INTO "user" ("id", "email", "roles", "teamId") VALUES 
('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'director1@hagerstone.com', '["Director"]', NULL),
('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2', 'director2@hagerstone.com', '["Director"]', NULL);

-- Team Heads (Fixed UUID format)
INSERT INTO "user" ("id", "email", "roles", "teamId") VALUES 
('11111111-2222-3333-4444-555555555555', 'design.head@hagerstone.com', '["TeamHead"]', '11111111-1111-1111-1111-111111111111'),
('22222222-3333-4444-5555-666666666666', 'procurement.head@hagerstone.com', '["TeamHead"]', '22222222-2222-2222-2222-222222222222'),
('33333333-4444-5555-6666-777777777777', 'crm.head@hagerstone.com', '["TeamHead"]', '33333333-3333-3333-3333-333333333333'),
('44444444-5555-6666-7777-888888888888', 'mis.head@hagerstone.com', '["TeamHead"]', '44444444-4444-4444-4444-444444444444'),
('55555555-6666-7777-8888-999999999999', 'hr.head@hagerstone.com', '["TeamHead"]', '55555555-5555-5555-5555-555555555555'),
('66666666-7777-8888-9999-aaaaaaaaaaaa', 'accounts.head@hagerstone.com', '["TeamHead"]', '66666666-6666-6666-6666-666666666666');

-- Team Members (Fixed UUID format)
INSERT INTO "user" ("id", "email", "roles", "teamId") VALUES 
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'designer1@hagerstone.com', '["TeamMember"]', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'procurement1@hagerstone.com', '["TeamMember"]', '22222222-2222-2222-2222-222222222222'),
('cccccccc-dddd-eeee-ffff-000000000000', 'crm1@hagerstone.com', '["TeamMember"]', '33333333-3333-3333-3333-333333333333'),
('dddddddd-eeee-ffff-0000-111111111111', 'mis1@hagerstone.com', '["TeamMember"]', '44444444-4444-4444-4444-444444444444'),
('eeeeeeee-ffff-0000-1111-222222222222', 'hr1@hagerstone.com', '["TeamMember"]', '55555555-5555-5555-5555-555555555555'),
('ffffffff-0000-1111-2222-333333333333', 'accounts1@hagerstone.com', '["TeamMember"]', '66666666-6666-6666-6666-666666666666');

-- AI Team Members (Full Access)
INSERT INTO "user" ("id", "email", "roles", "teamId") VALUES 
('12345678-1234-1234-1234-123456789abc', 'ai1@hagerstone.com', '["AI Team"]', '77777777-7777-7777-7777-777777777777'),
('87654321-4321-4321-4321-cba987654321', 'ai2@hagerstone.com', '["AI Team"]', '77777777-7777-7777-7777-777777777777');