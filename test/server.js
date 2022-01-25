const app = require('express')();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('@runtheons/session-manager/SessionManager').setJWTKey(
	'SECRET-RUNTHEONS-JWT'
);
require('@runtheons/session-manager/SessionManager').setKey(
	'SECRET-RUNTHEONS-KEY-THAT-IS-32B'
);

const router = require('./../index')(app);
router.getAvaibleRoute('./test/api/*');
router.load();

module.exports = router;