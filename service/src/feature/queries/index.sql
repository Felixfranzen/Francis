/* @name createFeature */
INSERT INTO feature (user_id, name, key) VALUES (:userId, :name, :key) RETURNING ID;

/* @name createFlag */
INSERT INTO flag (feature_id, name, enabled, predicates) VALUES (:featureId, :name, :enabled, :predicates) RETURNING ID;

/* @name deleteFeature */
DELETE FROM feature WHERE id = :id;

/* @name getFlagsByFeatureKey */
SELECT flag.name as name, enabled, predicates
FROM feature
JOIN flag ON flag.feature_id = feature.id WHERE key = :key;