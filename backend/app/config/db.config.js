module.exports = {
    HOST: "cis550tripal.ci4fuvpwyqqo.us-east-1.rds.amazonaws.com",
    PORT: "3306",
    USER: "tripal",
    PASSWORD: "CIS550Tripal",
    DB: "Tripal",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };