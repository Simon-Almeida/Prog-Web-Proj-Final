#!/usr/bin/env fish
# Source once per session from project root: source project.fish

alias commit-push='./scripts/commit-push.sh'
alias update-from='./scripts/update-from.sh'
alias switch-branch='./scripts/switch-branch.sh'
alias pull-branch='./scripts/pull-branch.sh'
alias github-update-branch='./scripts/github-update-branch.sh'
alias dev='./scripts/dev.sh'

echo "Project aliases loaded. Commands: commit-push, update-from, switch-branch, pull-branch, github-update-branch, dev"
