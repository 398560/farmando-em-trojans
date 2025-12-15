-- Seed sample games with Black Flash / Red and Black aesthetic theme
INSERT INTO games (title, description, price, image_url, rating, release_date, publisher, genres, features, system_requirements) VALUES
(
  'Shadow Strike: Red Dawn',
  'Experience intense combat in a dystopian future where speed is everything. Master lightning-fast reflexes in this action-packed adventure.',
  59.99,
  '/placeholder.svg?height=400&width=600',
  4.8,
  '2024-03-15',
  'Crimson Studios',
  ARRAY['Action', 'Adventure', 'RPG'],
  ARRAY['Single-player', 'Controller Support', 'Cloud Saves', 'Achievements'],
  '{"minimum": {"os": "Windows 10", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1060"}, "recommended": {"os": "Windows 11", "processor": "Intel i7", "memory": "16 GB RAM", "graphics": "RTX 3060"}}'::jsonb
),
(
  'Void Hunters',
  'Hunt creatures from beyond in this dark fantasy shooter. Team up or go solo in procedurally generated dungeons.',
  49.99,
  '/placeholder.svg?height=400&width=600',
  4.5,
  '2024-01-20',
  'Abyss Games',
  ARRAY['Shooter', 'Co-op', 'Horror'],
  ARRAY['Multiplayer', 'Co-op', 'Cross-platform', 'Voice Chat'],
  '{"minimum": {"os": "Windows 10", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1060"}, "recommended": {"os": "Windows 11", "processor": "Intel i7", "memory": "16 GB RAM", "graphics": "RTX 3070"}}'::jsonb
),
(
  'Crimson Velocity',
  'Race through neon-lit streets at breakneck speeds. Customize your ride and dominate the underground racing scene.',
  39.99,
  '/placeholder.svg?height=400&width=600',
  4.7,
  '2023-11-10',
  'Velocity Interactive',
  ARRAY['Racing', 'Sports', 'Simulation'],
  ARRAY['Single-player', 'Multiplayer', 'Customization', 'Leaderboards'],
  '{"minimum": {"os": "Windows 10", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1650"}, "recommended": {"os": "Windows 11", "processor": "Intel i7", "memory": "16 GB RAM", "graphics": "RTX 3060"}}'::jsonb
),
(
  'Eclipse Protocol',
  'Unravel a conspiracy in this narrative-driven sci-fi thriller. Your choices shape the fate of humanity.',
  44.99,
  '/placeholder.svg?height=400&width=600',
  4.9,
  '2024-02-05',
  'Nebula Games',
  ARRAY['Adventure', 'Story Rich', 'Sci-fi'],
  ARRAY['Single-player', 'Multiple Endings', 'Rich Story', 'Achievements'],
  '{"minimum": {"os": "Windows 10", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1060"}, "recommended": {"os": "Windows 11", "processor": "Intel i7", "memory": "16 GB RAM", "graphics": "RTX 3060"}}'::jsonb
),
(
  'Phantom Blade',
  'Become a legendary assassin in feudal Japan. Master the blade and strike from the shadows.',
  54.99,
  '/placeholder.svg?height=400&width=600',
  4.6,
  '2023-09-30',
  'Shadow Forge',
  ARRAY['Action', 'Stealth', 'Adventure'],
  ARRAY['Single-player', 'Stealth Gameplay', 'Combat', 'Open World'],
  '{"minimum": {"os": "Windows 10", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1060"}, "recommended": {"os": "Windows 11", "processor": "Intel i7", "memory": "16 GB RAM", "graphics": "RTX 3070"}}'::jsonb
),
(
  'Inferno Tactics',
  'Command your squad in tactical turn-based combat. Strategy meets chaos in this award-winning game.',
  34.99,
  '/placeholder.svg?height=400&width=600',
  4.4,
  '2023-07-15',
  'Tactical Mind Studios',
  ARRAY['Strategy', 'Turn-Based', 'Tactical'],
  ARRAY['Single-player', 'Turn-based Combat', 'Squad Management', 'Campaign Mode'],
  '{"minimum": {"os": "Windows 10", "processor": "Intel i3", "memory": "4 GB RAM", "graphics": "GTX 960"}, "recommended": {"os": "Windows 11", "processor": "Intel i5", "memory": "8 GB RAM", "graphics": "GTX 1060"}}'::jsonb
);
