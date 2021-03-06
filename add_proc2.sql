DROP PROCEDURE IF EXISTS add_proc; 
 
DELIMITER $$ 
 
CREATE PROCEDURE add_proc(IN idCur VARCHAR(100))
BEGIN
    IF NOT EXISTS (SELECT 1 FROM clues WHERE word=idCur) THEN
        INSERT INTO clues(word) VALUE (idCur);
    END IF;
END$$ 

DELIMITER ; 