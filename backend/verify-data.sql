-- Verify Teams
SELECT 'TEAMS:' as section;
SELECT id, name FROM team ORDER BY name;

-- Verify Users by Role
SELECT 'DIRECTORS:' as section;
SELECT id, email, roles FROM "user" WHERE roles LIKE '%Director%' ORDER BY email;

SELECT 'TEAM HEADS:' as section;
SELECT u.id, u.email, u.roles, t.name as team_name 
FROM "user" u 
LEFT JOIN team t ON u."teamId" = t.id 
WHERE u.roles LIKE '%TeamHead%' 
ORDER BY u.email;

SELECT 'TEAM MEMBERS:' as section;
SELECT u.id, u.email, u.roles, t.name as team_name 
FROM "user" u 
LEFT JOIN team t ON u."teamId" = t.id 
WHERE u.roles LIKE '%TeamMember%' 
ORDER BY u.email;

SELECT 'AI TEAM:' as section;
SELECT u.id, u.email, u.roles, t.name as team_name 
FROM "user" u 
LEFT JOIN team t ON u."teamId" = t.id 
WHERE u.roles LIKE '%AI Team%' 
ORDER BY u.email;

-- Summary
SELECT 'SUMMARY:' as section;
SELECT 
  (SELECT COUNT(*) FROM team) as total_teams,
  (SELECT COUNT(*) FROM "user") as total_users,
  (SELECT COUNT(*) FROM "user" WHERE roles LIKE '%Director%') as directors,
  (SELECT COUNT(*) FROM "user" WHERE roles LIKE '%TeamHead%') as team_heads,
  (SELECT COUNT(*) FROM "user" WHERE roles LIKE '%TeamMember%') as team_members,
  (SELECT COUNT(*) FROM "user" WHERE roles LIKE '%AI Team%') as ai_members;