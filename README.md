# Attractions

A modern web application built with Angular 18 for discovering and exploring attractions. This project provides an intuitive interface for users to browse, search, and learn about various attractions.

## Project Overview

This application is built using Angular 18, leveraging modern web development practices and following a component-based architecture. It provides a responsive and interactive user interface for exploring attractions.

## Architecture

The project follows the standard Angular architecture with the following structure:

```
attractions/
├── src/                      # Source code directory
│   ├── app/                  # Application components and modules
│   ├── environments/         # Environment configuration files
│   ├── assets/              # Static assets (images, icons, etc.)
│   ├── styles.scss          # Global styles
│   └── main.ts              # Application entry point
├── public/                   # Public assets directory
└── angular.json             # Angular configuration file
```

### Key Technical Decisions

- **Angular 19**: Latest version of Angular for robust frontend development
- **SCSS**: Used for styling with better organization and maintainability
- **TypeScript**: Strict type checking for better code quality
- **Responsive Design**: Mobile-first approach for all components

## Prerequisites

Ensure you have the following installed:

- **Node.js**: version 20.11.1 or higher
- **npm**: version 9.2.0 or higher
- **Angular CLI**: version 18.2.11

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone [repository-url]
   cd attractions
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

## Development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Testing

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Project Assumptions

1. **Browser Support**: The application is designed to work with modern browsers (last 2 versions of major browsers)
2. **Authentication**: Currently set up for local development without authentication
3. **API Integration**: Prepared for future integration with a backend API
4. **Responsive Design**: Supports screen sizes from 320px and up
5. **Performance**: Optimized for fast loading and smooth interactions

## Best Practices

- Follows Angular style guide and best practices
- Component-based architecture for better reusability
- Type safety with TypeScript
- Modular SCSS structure
- Lazy loading for better performance

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
