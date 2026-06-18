#!/usr/bin/env fish
# Source once per session from project root: source project.fish

mkdir -p .tmp

function _log_run
    set -l log .tmp/last-output.log
    set -l prev .tmp/previous-output.log
    if test -f $log
        cp $log $prev
    end
    $argv 2>&1 | tee $log
    or true
end

function commit-push;          _log_run ./scripts/commit-push.sh $argv;          end
function update-from;          _log_run ./scripts/update-from.sh $argv;          end
function switch-branch;        _log_run ./scripts/switch-branch.sh $argv;        end
function pull-branch;          _log_run ./scripts/pull-branch.sh $argv;          end
function github-update-branch; _log_run ./scripts/github-update-branch.sh $argv; end
function dev;                  _log_run ./scripts/dev.sh $argv;                  end

echo "Project functions loaded. Output logged to .tmp/last-output.log (previous: .tmp/previous-output.log)"
echo "Commands: commit-push, update-from, switch-branch, pull-branch, github-update-branch, dev"
