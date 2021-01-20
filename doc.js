var router = require("./Router");
router = new router(null);

var routes = router.getAvaibleRoute(process.argv[2]);

const routeDocumentation = require("@runtheons/route-documentation");
routeDocumentation.setConfig({ template: "1" })
routeDocumentation.generateDoc(routes);