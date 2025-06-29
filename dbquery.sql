CREATE DATABASE manzildb;

SELECT user, host, plugin FROM mysql.user WHERE user = 'root';


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '#User@1234';


FLUSH PRIVILEGES;
 
 
 SELECT * FROM manzildb.files;




USE manzildb;

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
