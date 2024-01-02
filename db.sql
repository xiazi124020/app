DROP SEQUENCE IF EXISTS seq_emp;
CREATE SEQUENCE seq_emp
    START 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    NO CYCLE
    CACHE 10;

DROP TABLE IF EXISTS t_user CASCADE;
CREATE TABLE t_user (
  id SERIAL PRIMARY KEY NOT NULL,
  dept_id INT DEFAULT NULL ,
  emp_id varchar(255) DEFAULT NULL ,
  name varchar(255) DEFAULT NULL ,
  name_kana varchar(255) DEFAULT NULL ,
  sex INT DEFAULT NULL ,
  birthday date DEFAULT NULL ,
  position INT DEFAULT NULL ,
  emp_div INT DEFAULT NULL ,
  phone varchar(255) DEFAULT NULL ,
  email varchar(255) DEFAULT NULL ,
  zip_code varchar(255) DEFAULT NULL ,
  address varchar(255) DEFAULT NULL ,
  password varchar(255) DEFAULT NULL,
  is_admin boolean DEFAULT false ,
  status int DEFAULT NULL ,
  is_deleted boolean DEFAULT false ,
  create_by varchar(255) DEFAULT NULL,
  update_by varchar(255) DEFAULT NULL,
  pwd_reset_time TIMESTAMP  DEFAULT NULL,
  create_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NULL ,
  update_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NULL
);

DROP TABLE IF EXISTS t_dept CASCADE;
CREATE TABLE t_dept (
  id SERIAL PRIMARY KEY NOT NULL,
  name varchar(255) DEFAULT NULL ,
  location INT DEFAULT NULL ,
  is_deleted boolean DEFAULT false ,
  create_by varchar(255) DEFAULT NULL,
  update_by varchar(255) DEFAULT NULL,
  pwd_reset_time TIMESTAMP  DEFAULT NULL,
  create_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NULL ,
  update_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NULL
) 