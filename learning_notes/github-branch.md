# 1. Git workflow with a branch
#
# Why use a branch: professionals do not work directly on main. Each piece of work gets its own branch, then is merged through a # pull request.
#
# Step 1: Create a branch and switch to it
# git checkout -b chore/clean-starter
#
# -b = create the branch and switch to it.
# chore/ prefix = housekeeping work, not a new feature.
# If the branch already exists you get fatal: a branch named ... already exists. Switch to it without -b:
# git checkout chore/clean-starter
# (git switch chore/clean-starter does the same.)
#
# 
# Step 2: Check where you are
# 
# git branch
# git status
# git log --oneline -5
#
# git branch lists branches; * marks the current one.
# git log --oneline -5 shows the last 5 commits.
#
# Check for commits that are on your branch but not on main:
# git log main..chore/clean-starter --oneline
# Empty output = no extra commits.
#
#
# 2. Cleaning starter code:
# Deleted src/App.css and src/assets/react.svg.
#
# 3. Commit and push 
#
# git status
# git add .
# git commit -m "chore: remove Vite starter code"
# git push -u origin chore/clean-starter
# git log main..chore/clean-starter --oneline
#
# -u links the local branch to the remote one. After this, plain git push works on this branch.
#
# 5. Pull request (PR) on GitHub
#
# A pull request is a request to merge one branch into another. It shows the changes, allows review, and keeps a record.

# Open the link printed by git push, or refresh the repo page and click Compare & pull request.
# Check the top of the page: base: main <- compare: chore/clean-starter.
#  - base = branch you merge INTO
#  - compare = branch with your changes
# Title: chore: remove Vite starter code. Click Create pull request.
# Open Files changed: red = removed, green = added.
# Back on Conversation, click Merge pull request, then Confirm merge.
#
#
# 6. Next: update local main after the merge
#
# The merge happened on GitHub, so local main is behind. Bring it up to date:
#
#   git checkout main
#   git pull
#
#
# Workflow to repeat for every feature
# git checkout main then git pull
# git checkout -b feat/name
# Make changes, test with npm run dev
# git status, git add ., git commit -m "feat: ..."
# git push -u origin feat/name
# Open PR on GitHub, review Files changed, merge