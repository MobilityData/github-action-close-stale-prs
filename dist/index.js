/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 838:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 766:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * The entrypoint for the action.
 */
const core = __nccwpck_require__(838);
const github = __nccwpck_require__(766);

async function closeStalePullRequests() {
  try {
    const token = core.getInput('github-token');
    const label = core.getInput('label-name');
    const client = new github.GitHub(token);

    // Get all open pull requests
    const { owner, repo } = github.context.repo;
    const response = await client.pulls.list({
      owner,
      repo,
      state: 'open'
    });

    const now = new Date();
    const hourInMs = 60 * 60 * 1000;
    const closeThreshold = 23 * hourInMs; // 23 hours

    // Check each pull request
    for (const pullRequest of response.data) {
      const createdAt = new Date(pullRequest.created_at);
      const ageInMs = now - createdAt;

      // Check if the pull request is older than the threshold and has the specified label
      if (ageInMs >= closeThreshold && pullRequest.labels.find(l => l.name === label)) {
        // Close the pull request
        await client.pulls.update({
          owner,
          repo,
          pull_number: pullRequest.number,
          state: 'closed'
        });

        console.log(`Closed stale pull request #${pullRequest.number}`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

closeStalePullRequests();
})();

module.exports = __webpack_exports__;
/******/ })()
;