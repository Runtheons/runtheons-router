var router = require("./Router");
router = new router(null);

const path = require("path");
const routepath = path.join(process.cwd(), "./../../../", process.argv[2]);
var routes = router.getAvaibleRoute(routepath);

console.log("Start generate doc in " + routepath);

const routeDocumentation = require("@runtheons/route-documentation");
routeDocumentation.setConfig({ template: "1" })
routeDocumentation.generateDoc(routes);
console.log("Generated doc");