-- Seed badges and update games with new Part 2 fields

-- Insert sample badges
INSERT INTO badges (name, description, icon_url) VALUES
  ('Early Adopter', 'Joined during the beta phase', '/badges/early-adopter.svg'),
  ('Tester', 'Helped test new features', '/badges/tester.svg'),
  ('Power User', 'Has over 50 apps installed', '/badges/power-user.svg'),
  ('Contributor', 'Reported bugs and provided feedback', '/badges/contributor.svg'),
  ('Elite', 'VIP member with exclusive access', '/badges/elite.svg')
ON CONFLICT DO NOTHING;

-- Update existing games with status and changelog
UPDATE games SET 
  status = 'stable',
  is_featured = true,
  changelog = '## Version 1.0.0
- Initial release
- Core gameplay mechanics
- Full story campaign'
WHERE title = 'Shadow Strike: Red Dawn';

UPDATE games SET 
  status = 'stable',
  changelog = '## Version 1.2.0
- New procedural dungeons
- Co-op matchmaking improvements
- Bug fixes and performance optimizations'
WHERE title = 'Void Hunters';

UPDATE games SET 
  status = 'beta',
  changelog = '## Version 0.9.5 (Beta)
- New racing tracks
- Improved physics engine
- Known issues: Minor texture glitches'
WHERE title = 'Crimson Velocity';

UPDATE games SET 
  status = 'stable',
  is_featured = true,
  changelog = '## Version 1.1.0
- Multiple story endings
- Enhanced dialogue system
- Performance improvements'
WHERE title = 'Eclipse Protocol';

UPDATE games SET 
  status = 'experimental',
  changelog = '## Version 0.5.0 (Experimental)
- New combat system (in testing)
- Experimental stealth mechanics
- Expect bugs and changes'
WHERE title = 'Phantom Blade';

UPDATE games SET 
  status = 'restricted',
  changelog = '## Version 2.0.0
- Complete tactical overhaul
- New campaign missions
- Restricted access for testing'
WHERE title = 'Inferno Tactics';
