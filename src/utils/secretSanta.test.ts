import { expect, test, describe } from 'vitest';
import { SecretSantaAssigner } from './secretSanta';
import { Employee, SecretSantaAssignment } from '../types';

describe('SecretSantaAssigner', () => {
  const employees: Employee[] = [
    { Employee_Name: 'John Doe', Employee_EmailID: 'john@acme.com' },
    { Employee_Name: 'Jane Smith', Employee_EmailID: 'jane@acme.com' },
    { Employee_Name: 'Bob Wilson', Employee_EmailID: 'bob@acme.com' },
  ];

  test('assigns secret children to all employees', () => {
    const assigner = new SecretSantaAssigner(employees);
    const assignments = assigner.assign();

    expect(assignments.length).toBe(employees.length);
    expect(assignments.every(a => a.Secret_Child_EmailID !== a.Employee_EmailID)).toBe(true);
  });

  test('respects previous year assignments', () => {
    const previousAssignments: SecretSantaAssignment[] = [
      {
        Employee_Name: 'John Doe',
        Employee_EmailID: 'john@acme.com',
        Secret_Child_Name: 'Jane Smith',
        Secret_Child_EmailID: 'jane@acme.com'
      }
    ];

    const assigner = new SecretSantaAssigner(employees, previousAssignments);
    const assignments = assigner.assign();

    const johnAssignment = assignments.find(a => a.Employee_EmailID === 'john@acme.com');
    expect(johnAssignment?.Secret_Child_EmailID).not.toBe('jane@acme.com');
  });

  test('each employee has exactly one secret child', () => {
    const assigner = new SecretSantaAssigner(employees);
    const assignments = assigner.assign();

    const secretChildren = assignments.map(a => a.Secret_Child_EmailID);
    const uniqueSecretChildren = new Set(secretChildren);
    expect(uniqueSecretChildren.size).toBe(employees.length);
  });
});