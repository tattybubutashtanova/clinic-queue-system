# 🤝 Contributing to Naryn Clinic Queue System

We welcome contributions from the community! This guide will help you get started with contributing to our clinic queue management system.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- Basic knowledge of React and Node.js

### Fork and Clone
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/clinic-queue-system.git
   cd clinic-queue-system
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/tattybubutashtanova/clinic-queue-system.git
   ```

## 🛠️ Development Setup

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

## 📝 Code Style Guidelines

### JavaScript/React
- Use **ES6+** syntax
- Use **functional components** with hooks
- Follow **React best practices**
- Use **descriptive variable names**
- Keep functions small and focused

#### Example Component Structure
```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, [dependency]);

  const handleClick = () => {
    // Handler logic
  };

  return (
    <motion.div
      className="component-name"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component content */}
    </motion.div>
  );
}

export default ComponentName;
```

### CSS Guidelines
- Use **CSS variables** for theming
- Follow **BEM** methodology for class names
- Use **flexbox** and **grid** for layouts
- Keep styles **mobile-first**

#### Example CSS Structure
```css
.component-name {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
}

.component-name__header {
  font-size: var(--font-size-lg);
  color: var(--primary-color);
}

.component-name--active {
  background-color: var(--success-color);
}
```

### File Naming
- Use **PascalCase** for components: `ComponentName.js`
- Use **camelCase** for utilities: `helpers.js`
- Use **kebab-case** for documentation: `api-reference.md`

## 🔄 Pull Request Process

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, readable code
- Follow the style guidelines
- Add tests for new features
- Update documentation

### 3. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

#### Commit Message Format
Use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add patient queue management"
git commit -m "fix: resolve time slot booking conflict"
git commit -m "docs: update API documentation"
```

### 4. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- **Clear title** describing the change
- **Detailed description** of what you've done
- **Screenshots** for UI changes
- **Testing instructions** if applicable

### 5. Code Review
- Respond to review comments promptly
- Make requested changes
- Keep the PR updated

## 🐛 Issue Reporting

### Bug Reports
When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots** if applicable
- **Error messages** from browser console

#### Bug Report Template
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. Ubuntu 20.04]
- Browser: [e.g. Chrome 91.0]
- Node.js: [e.g. 16.14.0]
- React: [e.g. 18.2.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Add any other context about the problem here
```

### Feature Requests
For new features, please include:
- **Problem statement** you're trying to solve
- **Proposed solution** with implementation ideas
- **Alternative approaches** considered
- **Use case** examples

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for new components and functions
- Use **Jest** and **React Testing Library**
- Test user interactions, not implementation details
- Aim for **80%+ code coverage**

#### Example Test
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

test('renders component correctly', () => {
  render(<ComponentName prop1="value" />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});

test('handles click events', () => {
  const handleClick = jest.fn();
  render(<ComponentName onClick={handleClick} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

### Integration Tests
- Test API endpoints
- Test component interactions
- Test user workflows

### Manual Testing
- Test on different browsers
- Test on mobile devices
- Test accessibility features

## 📚 Documentation

### Code Comments
- Add comments for complex logic
- Explain business rules
- Document API endpoints
- Include examples in complex functions

### README Updates
- Update installation instructions
- Add new features to feature list
- Update configuration requirements
- Add troubleshooting information

### API Documentation
- Document new endpoints
- Update request/response examples
- Include error scenarios
- Add authentication requirements

## 🎯 Areas of Contribution

### Frontend (React)
- **UI Components**: New reusable components
- **Pages**: New application pages
- **Hooks**: Custom React hooks
- **Styling**: CSS improvements and animations
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimization and code splitting

### Backend (Node.js)
- **API Endpoints**: New REST endpoints
- **Middleware**: Authentication, validation, logging
- **Database**: Schema design and queries
- **Error Handling**: Better error responses
- **Security**: Input validation and sanitization
- **Performance**: Caching and optimization

### Features We're Looking For
- **Multi-doctor support**: Multiple doctors per department
- **Appointment reminders**: SMS/email notifications
- **Patient history**: Medical records integration
- **Reporting**: Analytics and reports
- **Mobile app**: React Native application
- **Integration**: Third-party system integrations

## 🏆 Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **Release notes**: Feature attributions
- **Community highlights**: Outstanding contributions
- **Swag**: Stickers and merchandise (when available)

## 📋 Code Review Checklist

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design works
- [ ] Accessibility features implemented
- [ ] Performance considerations addressed
- [ ] Security best practices followed

### Review Process
- **Automated checks**: CI/CD pipeline
- **Code review**: Peer review by maintainers
- **Testing**: Manual testing by team
- **Documentation**: Documentation review
- **Security**: Security audit for sensitive changes

## 🚀 Release Process

### Version Bumping
- **Patch** (x.x.X): Bug fixes, documentation
- **Minor** (x.X.x): New features, API changes
- **Major** (X.x.x): Breaking changes

### Release Steps
1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to production
5. Update documentation

## 📞 Getting Help

### For Contributors
- **Discord**: Join our community server
- **Email**: contributors@clinic.kg
- **GitHub Issues**: Tag maintainers for help

### Resources
- **React Documentation**: [react.dev](https://react.dev)
- **Node.js Documentation**: [nodejs.org](https://nodejs.org)
- **MDN Web Docs**: [developer.mozilla.org](https://developer.mozilla.org)

## 🎉 Celebrating Contributions

We celebrate all contributions:
- **First-time contributors**: Special recognition
- **Significant features**: Featured in releases
- **Bug fixes**: Acknowledged in release notes
- **Documentation**: Appreciated in community posts
- **Community help**: Recognized in discussions

## 📜 Code of Conduct

Please be respectful and professional:
- **Welcome** new contributors
- **Be constructive** in feedback
- **Be patient** with questions
- **Be inclusive** in language and behavior
- **Focus on** what's best for the community

## 🔐 Security

If you discover a security vulnerability:
- **Don't** open a public issue
- **Email** security@clinic.kg
- **Include** detailed description
- **Wait** for our response before disclosing

---

**Thank you for contributing! 🙏**

Every contribution helps make the Naryn Clinic Queue System better for healthcare providers and patients alike.
