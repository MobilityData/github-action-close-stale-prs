/**
 * The entrypoint for the action.
 */
const core = require('@actions/core');
const github = require('@actions/github');

async function closeStalePullRequests() {
  try {
    const token = core.getInput('github-token');
    const numbeOfHours = core.getInput('numnber-of-hours');
    const label = core.getInput('label-name');
    const octokit = new github.getOctokit(token);

    // Get all open pull requests
    const { owner, repo } = github.context.repo;
    const response = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'open'
    });

    const now = new Date();
    const hourInMs = 60 * 60 * 1000;
    const closeThreshold = parseInt(numbeOfHours) * hourInMs; // The number of hours beyond which a PR is considered stale at runtime.

    // Check each pull request
    for (const pullRequest of response.data) {
      const createdAt = new Date(pullRequest.created_at);
      const ageInMs = now - createdAt;

      // Check if the pull request is older than the threshold and has the specified label
      if (ageInMs >= closeThreshold && pullRequest.labels.find(l => l.name === label)) {
        // Close the pull request
        await octokit.rest.pulls.update({
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