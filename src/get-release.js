const core = require("@actions/core");
const { GitHub, context } = require("@actions/github");

async function run() {
  try {
    console.log("starting into get-release");

    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    console.log("have the Github token");

    // Get owner and repo from context of payload that triggered the action
    const { owner, repo } = context.repo;

    console.log(`owner '${owner}' and repo '${repo}'`);

    // Get the tag name from the triggered action
    const tagName = context.ref;

    console.log(`tagName: '${tagName}'`);

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = tagName.replace("refs/tags/", "");

    // Get a release from the tag name
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    const getReleaseResponse = await github.repos.getReleaseByTag({
      owner,
      repo,
      tag
    });

    // Get the ID, html_url, and upload URL for the created Release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
    } = getReleaseResponse;

    console.log(
      `Got release info: '${releaseId}', '${htmlUrl}', '${uploadUrl}'`
    );

    // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput("id", releaseId.toString());
    core.setOutput("html_url", htmlUrl);
    core.setOutput("upload_url", uploadUrl);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

module.exports = run;
