# Overview

This is a full-stack jewelry e-commerce website for "Shree Jewellers" built with React, Express, and PostgreSQL. The application showcases jewelry collections based on Mamdej Jewellers catalog across categories (Patta Poth 22K, Necklaces 20K/22K, Fancy Poth 22K, Chokers 22K), features live gold/silver rate displays, and provides a modern shopping experience with customer interaction tools like chat widgets and call buttons.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Styling**: Tailwind CSS with custom design system featuring gold/navy color scheme and Playfair Display/Inter fonts
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Routing**: Wouter for client-side routing with category-based navigation
- **State Management**: TanStack Query for server state management and caching
- **Design Pattern**: Component-based architecture with reusable UI components and custom hooks

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with structured error handling and request logging middleware
- **Data Access**: Repository pattern with in-memory storage implementation (easily replaceable with database layer)
- **Development Setup**: Hot module replacement with Vite integration for seamless development experience

## Database Design
- **Database**: MongoDB with Mongoose ODM for flexible document-based storage
- **Schema**: Enhanced entities - users (with roles), products (with image management), categories, and rates
- **Image Storage**: Cloudinary integration for optimized image upload and delivery
- **Validation**: Zod schemas for runtime type checking and API validation
- **Authentication**: JWT-based user authentication with role-based access control

## Authentication & Authorization
- Currently using basic user schema structure (prepared for future authentication implementation)
- Session management infrastructure in place with connect-pg-simple for PostgreSQL session storage

## External Dependencies
- **Database**: Neon PostgreSQL serverless database for scalable data storage
- **Development Tools**: 
  - Replit integration with cartographer and error overlay plugins
  - ESBuild for production bundling
  - TypeScript for type safety across the stack
- **UI Libraries**: 
  - Font Awesome for icons
  - Unsplash/Pixabay for product imagery
  - Google Fonts for typography (Playfair Display, Inter)
- **Utilities**: 
  - Date-fns for date manipulation
  - Nanoid for unique ID generation
  - Class-variance-authority for component variant management

## Key Features
- Real-time gold/silver rate tracking with automatic refresh
- Category-based product browsing with search functionality
- Featured products showcase with material-based filtering
- Interactive customer support via chat widget and direct call integration
- Responsive design optimized for both desktop and mobile experiences
- Comprehensive contact information and store location details