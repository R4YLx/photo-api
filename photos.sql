CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    password VARCHAR(250) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE photos (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    url VARCHAR(250) NOT NULL,
    comment VARCHAR(250) DEFAULT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE albums (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE photos_albums (
    id INT NOT NULL AUTO_INCREMENT,
    photo_id INT NOT NULL,
    album_id INT NOT NULL,
    PRIMARY KEY (id)
)

ALTER TABLE photos_albums
ADD CONSTRAINT FOREIGN KEY (`photo_id`) REFERENCES `users` (`id`),
ADD CONSTRAINT FOREIGN KEY (`album_id`) REFERENCES `users` (`id`)