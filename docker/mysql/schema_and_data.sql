
CREATE TABLE `todo_lists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `completed` tinyint(4) NOT NULL DEFAULT '0',
  `listId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fd078d23aa52482d19347a96274` (`listId`),
  CONSTRAINT `FK_fd078d23aa52482d19347a96274` FOREIGN KEY (`listId`) REFERENCES `todo_lists` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

INSERT INTO `todo_lists` (`id`, `name`)
VALUES
	(1, 'List 1'),
	(2, 'List 2'),
	(3, 'List 3');

