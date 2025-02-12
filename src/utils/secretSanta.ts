import { Employee, SecretSantaAssignment } from '../types';

export class SecretSantaAssigner {
  private employees: Employee[];
  private previousAssignments: SecretSantaAssignment[];

  constructor(employees: Employee[], previousAssignments: SecretSantaAssignment[] = []) {
    this.employees = employees;
    this.previousAssignments = previousAssignments;
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private isValidAssignment(santa: Employee, child: Employee): boolean {
    // Santa cannot be their own child
    if (santa.Employee_EmailID === child.Employee_EmailID) {
      return false;
    }

    // Check if this assignment existed in previous year
    const previousAssignment = this.previousAssignments.find(
      assignment => 
        assignment.Employee_EmailID === santa.Employee_EmailID &&
        assignment.Secret_Child_EmailID === child.Employee_EmailID
    );

    return !previousAssignment;
  }

  public assign(): SecretSantaAssignment[] {
    const assignments: SecretSantaAssignment[] = [];
    const availableChildren = [...this.employees];
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      assignments.length = 0;
      const shuffledChildren = this.shuffle(availableChildren);
      let success = true;

      for (let i = 0; i < this.employees.length; i++) {
        const santa = this.employees[i];
        let assigned = false;

        for (let j = 0; j < shuffledChildren.length; j++) {
          const child = shuffledChildren[j];
          if (!assignments.some(a => a.Secret_Child_EmailID === child.Employee_EmailID) &&
              this.isValidAssignment(santa, child)) {
            assignments.push({
              ...santa,
              Secret_Child_Name: child.Employee_Name,
              Secret_Child_EmailID: child.Employee_EmailID
            });
            assigned = true;
            break;
          }
        }

        if (!assigned) {
          success = false;
          break;
        }
      }

      if (success) {
        return assignments;
      }

      attempts++;
    }

    throw new Error('Unable to generate valid Secret Santa assignments');
  }
}