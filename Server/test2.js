const dns = require("dns");

dns.setServers(["8.8.8.8"]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.wqzpbik.mongodb.net",
  (err, records) => {
    console.log(err);
    console.log(records);
  }
);