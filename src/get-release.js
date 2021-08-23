const core = require("@actions/core");
const { GitHub, context } = require("@actions/github");

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get owner and repo from context of payload that triggered the action
    const { owner, repo } = context.repo;

    // Get the tag name from the triggered action
    const tagName = context.ref;

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

    // Get the outputs for the created release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl, name: name, body: body, draft: draft, prerelease: prerelease, author: author }
    } = getReleaseResponse;

    console.log(`Got release info: '${releaseId}', '${htmlUrl}', '${uploadUrl}', '${name}', '${draft}', '${prerelease}', '${body}'`);

    // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput("id", releaseId.toString());
    core.setOutput("html_url", htmlUrl);
    core.setOutput("upload_url", uploadUrl);
    core.setOutput("tag_name", tag);
    core.setOutput("name", name);
    core.setOutput("body", body);
    core.setOutput("draft", draft);
    core.setOutput("prerelease", prerelease);
    core.setOutput("author", author);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

module.exports = run;

