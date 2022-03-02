-- Contains user auth info in addition to points allotment. 
-- points won't exist after registration, 
-- user needs to submit calculate points form to have a points value.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  points INTEGER
);

-- for user created meals based on choosen ingredients
-- CREATE TABLE user_meals (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users ON DELETE CASCADE,
--   name TEXT NOT NULL
-- );

-- recipes that have been saved by ANY user.
CREATE TABLE recipes (
  recipe_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  ww_points INTEGER
);

-- saved recipes associated with a single user
-- differnt users can have same recipe
CREATE TABLE users_recipes (
  recipe_id INTEGER REFERENCES recipes ON DELETE CASCADE,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, user_id)
);

-- stores user mealplans
-- can have same meal applied to several different days
CREATE TABLE user_mealplan (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes ON DELETE CASCADE,
  day TEXT NOT NULL
);