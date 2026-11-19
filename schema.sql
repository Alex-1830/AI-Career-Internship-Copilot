
CREATE DATABASE IF NOT EXISTS career_copilot
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE career_copilot;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    password_hash VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
) ENGINE=InnoDB;

-- 2. Resume analysis
CREATE TABLE IF NOT EXISTS resume_analysis (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    resume_text LONGTEXT,
    skills TEXT,
    analyzed_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT resume_analysis_ibfk_1
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 3. Career plans
CREATE TABLE IF NOT EXISTS career_plans (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    recommended_role VARCHAR(100) DEFAULT NULL,
    learning_plan LONGTEXT,
    project_recommendations LONGTEXT,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT career_plans_ibfk_1
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 4. Skill progress
CREATE TABLE IF NOT EXISTS skill_progress (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    is_completed TINYINT(1) DEFAULT '1',
    completed_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_user_skill (user_id, skill_name),
    CONSTRAINT skill_progress_ibfk_1
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 5. Internship applications
CREATE TABLE IF NOT EXISTS internship_applications (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    company VARCHAR(150) DEFAULT NULL,
    role VARCHAR(150) DEFAULT NULL,
    application_status VARCHAR(50) DEFAULT 'Applied',
    applied_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT internship_applications_ibfk_1
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
