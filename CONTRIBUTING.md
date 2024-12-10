# Contributing to Sketchy Colorspace

This document outlines our Git workflow and contribution guidelines.

## Git Workflow

### Branch Strategy

We use the following branch structure:
- `main` - Production-ready code
- `development` - Integration branch for features
- `feature/*` - Feature branches (e.g., `feature/add-pdf-export`)
- `hotfix/*` - For urgent fixes needed in production

### Process for New Features

1. **Create a Feature Branch**
   ```bash
   # Update development branch
   git checkout development
   git pull origin development

   # Create feature branch
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Make your changes in small, logical commits
   - Push regularly to backup your work
   ```bash
   git add .
   git commit -m "type: subject"
   git push -u origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Push final changes
   - Create PR to development branch
   - Request review if needed

4. **Review and Merge**
   - Address any review comments
   - Merge into development
   - Delete feature branch when done

### Commit Message Format

We follow a standardized commit message format:
```
type: subject

body (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat: add PDF export functionality

- Add PDF generation using html2pdf
- Add download button to UI
- Add PDF preview
```

```
fix: resolve estimate deletion issue

Fix bug where deleted estimates were still showing in dashboard
```

### Pull Request Guidelines

1. **Title**: Use the same format as commit messages
   ```
   feat: add user authentication
   ```

2. **Description**: Include:
   - What changes were made
   - Why changes were needed
   - Any testing done
   - Screenshots if UI changes

3. **Size**: Keep PRs small and focused
   - One feature/fix per PR
   - Split large features into smaller PRs

### Code Review Process

1. **Self-Review**
   - Review your own changes first
   - Run tests locally
   - Check for style consistency

2. **Peer Review**
   - Request review from team members
   - Address all comments
   - Mark conversations as resolved

3. **Approval and Merge**
   - Require at least one approval
   - Squash and merge to keep history clean
   - Delete feature branch after merge

## Development Guidelines

### Before Starting

1. **Check Existing Issues**
   - Look for related issues/PRs
   - Discuss major changes first

2. **Update Branches**
   ```bash
   git checkout development
   git pull origin development
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

### During Development

1. **Commit Regularly**
   - Make small, logical commits
   - Use clear commit messages

2. **Keep Updated**
   ```bash
   git fetch origin
   git rebase origin/development
   ```

3. **Test Your Changes**
   - Run tests locally
   - Test edge cases
   - Check mobile/desktop views

### Ready for Review

1. **Final Checks**
   - Rebase if needed
   - Run final tests
   - Update documentation

2. **Create Pull Request**
   - Use PR template
   - Request reviews
   - Link related issues

## Questions?

If you have questions about the process, please reach out to the team lead.
