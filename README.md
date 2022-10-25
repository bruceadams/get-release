# GitHub Action - Get a Release

This GitHub Action (written in JavaScript) wraps the [GitHub Release API](https://developer.github.com/v3/repos/releases/), specifically the [Get a Release](https://developer.github.com/v3/repos/releases/#create-a-release) endpoint, to allow you to leverage GitHub Actions to get releases.

## Usage

### Pre-requisites

Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow) is available below. My [yj](https://github.com/bruceadams/yj) project uses this Action, see [release.yml](https://github.com/bruceadams/yj/blob/main/.github/workflows/release.yml). For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

This Action requires that the environment variable `GITHUB_TOKEN` be set correctly.

### Outputs

For more information on these outputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#response-4) for an example of what these outputs look like

- `id`: The release ID
- `html_url`: The URL users can navigate to in order to view the release. For example `https://github.com/octocat/Hello-World/releases/v1.0.0`
- `upload_url`: The URL for uploading assets to the release, which could be used by GitHub Actions for additional uses, for example the [`@actions/upload-release-asset`](https://www.github.com/actions/upload-release-asset) GitHub Action
- `tag_name`: The git tag associated with the release. For example: `v1.1.0`

### Example workflow

Everytime a new release is created, build a binary for the release and upload it to the release on GitHub. This example is building and uploading a Linux binary for a Rust executable.

```yaml
on:
  release:
    types: [created]

jobs:
  build:
    name: Build release binary
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Get release
        id: get_release
        uses: bruceadams/get-release@v1.3.2
        env:
          GITHUB_TOKEN: ${{ github.token }}

      - name: Build binary
        run: cargo build --release --verbose

      - name: Upload release binary
        uses: actions/upload-release-asset@v1.0.2
        env:
          GITHUB_TOKEN: ${{ github.token }}
        with:
          upload_url: ${{ steps.get_release.outputs.upload_url }}
          asset_path: ./target/release/my-widget
          asset_name: my-widget
          asset_content_type: application/octet-stream
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
