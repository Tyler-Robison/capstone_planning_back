SELECT r.recipe_id, m.day, r.name, r.ww_points
      FROM user_mealplan m
      JOIN user_recipes r
      ON r.recipe_id  =  m.recipe_id
      WHERE m.user_id = 3;