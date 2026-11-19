#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Resolve the single commit tagged by a Release Please release cohort."""
import argparse
import json
import os
from pathlib import Path
import subprocess

from release_artifacts import approved_manifest


def released_commit(repository, outputs):
    paths = json.loads(outputs['paths_released'])
    if not isinstance(paths, list) or not paths or any(not isinstance(path, str) for path in paths):
        raise ValueError('Release Please must supply the released paths')
    commits = set()
    for path in paths:
        tag = outputs[path + '--tag_name']
        commit = subprocess.check_output(
            ['git', 'rev-parse', '--verify', 'refs/tags/' + tag + '^{commit}'],
            cwd=repository, text=True).strip()
        commits.add(commit)
    if len(commits) != 1:
        raise ValueError('Released tags must point to one commit')
    return commits.pop()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--require-hosted', action='store_true', help='guard manual publication from this checkout')
    args = parser.parse_args()
    if args.require_hosted:
        if approved_manifest(args.repository, 'HEAD'):
            parser.exit(1, 'This release requires qualified publication with --evidence\n')
        parser.exit()
    commit = released_commit(args.repository, json.loads(os.environ['RELEASE_OUTPUTS_JSON']))
    publication = 'qualified' if approved_manifest(args.repository, commit) else 'hosted'
    with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
        output.write('released_commit=' + commit + '\n')
        output.write('publication=' + publication + '\n')
