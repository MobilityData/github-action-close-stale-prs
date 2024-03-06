# Close outdated PRs

Closes pull requests with the specified label that are older than 23 hours.

## Inputs

### `github-token`

**Required** GitHub Token with repo scope.

### `number-of-hours`

**Required** The number of hours beyond which a PR is considered stale at runtime.

### `label-name`

**Required** The label of PRs to evaluate for closing.

## Outputs

None.

## Example usage

```yaml
name: Close stale issues
id: close-stale-issues
uses: MobilityData/github-action-close-stale-prs@main
with:
    github-token: ${{ env.CREDENTIALS }}
    number-of-hours: 23
    label-name: 'automated-content-update'
```
