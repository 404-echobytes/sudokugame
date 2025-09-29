# Sudoku Game Application

## Overview

This is a full-stack web application featuring an interactive Sudoku game built with React, TypeScript, and Express.js. The application includes both classic and time trial game modes with audio feedback, a comprehensive user dashboard with ranking system, scoring mechanics, and a modern UI built with Radix UI components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for client-side state management
- **UI Components**: Radix UI primitives with custom styling
- **3D Graphics**: React Three Fiber ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing)
- **Audio**: HTML5 Audio API with custom audio management

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Pattern**: REST API with Express routes
- **Session Management**: Basic session storage setup (connect-pg-simple)

### Development Architecture
- **Module System**: ES Modules throughout
- **TypeScript**: Strict configuration with path mapping
- **Development Server**: Vite dev server with HMR
- **Production Build**: Vite build + esbuild for server bundling

## Key Components

### Game Logic (`client/src/lib/sudoku.ts`)
- Sudoku puzzle generation and validation
- Move validation and conflict detection
- Game completion checking
- Support for multiple difficulty levels

### State Management
- **useSudoku**: Main game state (grid, moves, completion, timer, scoring)
- **useAudio**: Audio system management (background music, sound effects)
- **useUser**: User statistics, scoring, ranking system, and achievement tracking

### UI Components
- **GameBoard**: Interactive 9x9 Sudoku grid with cell selection
- **GameModeSelector**: Classic vs Time Trial mode selection
- **Timer**: Countdown timer for time trial mode
- **CompletionModal**: Victory screen with confetti animation and score display
- **GameControls**: Hint system, reset, and audio controls
- **UserDashboard**: Comprehensive statistics, ranking system, and achievements display

### Audio System
- Background music support
- Sound effects for moves and completion
- Mute/unmute functionality
- Audio preloading and management

## Data Flow

1. **App Initialization**:
   - Application starts with user dashboard as the default view
   - User can access game through multiple "Play" buttons throughout the dashboard
   - Dashboard displays current user statistics, rank, and achievements

2. **Game Initialization**:
   - User clicks "Play" button from dashboard to navigate to game
   - User selects game mode (Classic or Time Trial)
   - System generates new Sudoku puzzle
   - Game state is initialized and persisted

2. **Gameplay Loop**:
   - User selects cell and inputs number
   - Move validation occurs in real-time
   - Conflicts are highlighted immediately
   - Progress is continuously saved to localStorage

3. **Game Completion**:
   - System detects puzzle completion
   - Score calculation: 50 points for Classic, 150+ points for Time Trial (with time bonus)
   - User statistics updated with new score and completion data
   - Success audio plays and confetti animation triggers
   - Points and achievements displayed in completion modal

4. **User Progress Tracking**:
   - All puzzle completions tracked with timestamps
   - Ranking system based on total score (9 ranks from Beginner to Sudoku God)
   - Achievement system with unlockable badges
   - Statistics include: total score, puzzles completed, best times, average completion time

5. **State Persistence**:
   - Game state automatically saved to localStorage
   - User statistics and progress persisted across sessions
   - Dashboard accessible via navigation button

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for server state
- **UI Framework**: Radix UI components, Tailwind CSS, class-variance-authority
- **State Management**: Zustand with middleware support
- **3D Graphics**: React Three Fiber ecosystem
- **Build Tools**: Vite, esbuild, TypeScript
- **Database**: Drizzle ORM, Neon Database serverless driver

### Development Dependencies
- **TypeScript**: Strict type checking and path mapping
- **PostCSS**: For Tailwind CSS processing
- **GLSL**: Shader support for 3D graphics
- **Font Management**: Fontsource for web fonts

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations for schema management

### Environment Setup
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection (development/production)
- **Port Configuration**: Express server port management

### Database Schema
- **Users Table**: Basic user management with username/password
- **Schema Location**: `shared/schema.ts` for type sharing
- **Migration Management**: Drizzle Kit for database migrations

### Production Considerations
- Static file serving through Express in production
- Database connection pooling through Neon serverless
- Asset optimization for 3D models and audio files
- Error handling and logging middleware

### Development Features
- **Hot Module Replacement**: Vite HMR for rapid development
- **Runtime Error Overlay**: Custom error modal for development
- **Type Safety**: Shared types between client and server
- **Path Aliases**: Simplified imports with @ and @shared prefixes