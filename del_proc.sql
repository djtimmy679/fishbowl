DROP PROCEDURE IF EXISTS del_proc; 

DELIMITER $$

CREATE PROCEDURE del_proc(IN newClue VARCHAR(100))
BEGIN
    DELETE FROM clues
    WHERE word = newClue;
END$$ 

DELIMITER ;
