CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(250) NOT NULL,
    password VARCHAR(250) NOT NULL,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
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

CREATE TABLE albums_photos (
    id INT NOT NULL AUTO_INCREMENT,
    photo_id INTEGER UNSIGNED REFERENCES photos(id),
    album_id INTEGER UNSIGNED REFERENCES albums(id),
    PRIMARY KEY (id)
);