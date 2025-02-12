# Secret Santa Assigner

A modern web application for automatically assigning Secret Santa pairs while respecting previous year's assignments.

## Features

- 🎅 Automated Secret Santa assignment generation
- 🔄 Prevents repeat assignments from previous years
- 📊 CSV import/export functionality
- ✅ Validation for input data
- 🎯 Fair distribution algorithm
- 🚫 Self-assignment prevention
- 📱 Responsive design

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Vitest for testing
- Papa Parse for CSV handling

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 7 or higher

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Input CSV Format

#### Employee CSV
Required columns:
- `Employee_Name`: Full name of the employee
- `Employee_EmailID`: Email address of the employee

Example:
```csv
Employee_Name,Employee_EmailID
Hamish Murray,hamish.murray@acme.com
Layla Graham,layla.graham@acme.com
```

#### Previous Assignments CSV (Optional)
Required columns:
- `Employee_Name`: Name of the Secret Santa
- `Employee_EmailID`: Email of the Secret Santa
- `Secret_Child_Name`: Name of the assigned recipient
- `Secret_Child_EmailID`: Email of the assigned recipient

Example:
```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
John Doe,john@acme.com,Jane Smith,jane@acme.com
Jane Smith,jane@acme.com,John Doe,john@acme.com
```

### Assignment Rules

1. An employee cannot be their own Secret Santa
2. An employee cannot be assigned to the same person as the previous year
3. Each employee must be assigned exactly one Secret Santa
4. Each employee must be assigned as a Secret Santa exactly once

## Architecture

The application follows SOLID principles and is built with modularity in mind:

### Core Components

1. **SecretSantaAssigner**: Core class handling the assignment logic
   - Implements the assignment algorithm
   - Handles validation and constraints
   - Manages previous year's assignments

2. **CSV Processing**:
   - Input validation
   - Data transformation
   - Error handling

3. **UI Components**:
   - File upload handlers
   - Assignment display
   - Error messaging

### Design Patterns

- **Strategy Pattern**: Used in the assignment algorithm to allow for different assignment strategies
- **Factory Pattern**: Employed in CSV processing for different file types
- **Observer Pattern**: Implemented in the UI for real-time updates

## Testing

Run the test suite:

```bash
npm run test
```

The test suite covers:
- Input validation
- Assignment generation
- Constraint checking
- Edge cases
- CSV processing

## Error Handling

The application implements comprehensive error handling:

1. **CSV Validation**:
   - File format checking
   - Required column validation
   - Data type verification
   - Empty value detection

2. **Assignment Validation**:
   - Minimum employee count check
   - Duplicate assignment prevention
   - Previous year conflict detection

3. **User Feedback**:
   - Clear error messages
   - Toast notifications
   - Visual feedback for actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

