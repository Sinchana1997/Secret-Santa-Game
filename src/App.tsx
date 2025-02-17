import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Gift, Download, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { SecretSantaAssigner } from './utils/secretSanta';
import { Employee, SecretSantaAssignment, CSVData } from './types';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [previousAssignments, setPreviousAssignments] = useState<SecretSantaAssignment[]>([]);
  const [assignments, setAssignments] = useState<SecretSantaAssignment[]>([]);

  const validateEmployeeCSV = (data: any[]): data is Employee[] => {
    return data.every(row => 
      typeof row === 'object' &&
      'Employee_Name' in row &&
      'Employee_EmailID' in row &&
      'Team' in row &&
      typeof row.Employee_Name === 'string' &&
      typeof row.Employee_EmailID === 'string' &&
      typeof row.Team === 'string' &&
      row.Employee_Name.trim() !== '' &&
      row.Employee_EmailID.trim() !== '' &&
      row.Team.trim() !== ''
    );
  };

  const validatePreviousAssignmentsCSV = (data: any[]): data is SecretSantaAssignment[] => {
    return data.every(row =>
      typeof row === 'object' &&
      'Employee_Name' in row &&
      'Employee_EmailID' in row &&
      'Secret_Child_Name' in row &&
      'Secret_Child_EmailID' in row &&
      typeof row.Employee_Name === 'string' &&
      typeof row.Employee_EmailID === 'string' &&
      typeof row.Secret_Child_Name === 'string' &&
      typeof row.Secret_Child_EmailID === 'string' &&
      row.Employee_Name.trim() !== '' &&
      row.Employee_EmailID.trim() !== '' &&
      row.Secret_Child_Name.trim() !== '' &&
      row.Secret_Child_EmailID.trim() !== ''
    );
  };

  const onEmployeesDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (results: CSVData) => {
        if (results.errors.length > 0) {
          const errorMessage = results.errors.map(error => 
            `Row ${error.row + 1}: ${error.message}`
          ).join('\n');
          toast.error(`CSV parsing error:\n${errorMessage}`);
          return;
        }

        if (!validateEmployeeCSV(results.data)) {
          toast.error('Invalid employee CSV format. Please ensure all required fields are present and not empty.');
          return;
        }

        if (results.data.length < 2) {
          toast.error('At least 2 employees are required for Secret Santa');
          return;
        }

        setEmployees(results.data as Employee[]);
        toast.success(`${results.data.length} employees loaded successfully`);
      },
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    });
  };

  const onPreviousAssignmentsDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (results: CSVData) => {
        if (results.errors.length > 0) {
          const errorMessage = results.errors.map(error => 
            `Row ${error.row + 1}: ${error.message}`
          ).join('\n');
          toast.error(`CSV parsing error:\n${errorMessage}`);
          return;
        }

        if (!validatePreviousAssignmentsCSV(results.data)) {
          toast.error('Invalid previous assignments CSV format. Please ensure all required fields are present and not empty.');
          return;
        }

        setPreviousAssignments(results.data as SecretSantaAssignment[]);
        toast.success(`${results.data.length} previous assignments loaded successfully`);
      },
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    });
  };

  const { getRootProps: getEmployeesRootProps, getInputProps: getEmployeesInputProps } = useDropzone({
    onDrop: onEmployeesDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const { getRootProps: getPreviousRootProps, getInputProps: getPreviousInputProps } = useDropzone({
    onDrop: onPreviousAssignmentsDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const generateAssignments = () => {
    try {
      if (employees.length === 0) {
        toast.error('Please upload employee data first');
        return;
      }

      if (employees.length < 2) {
        toast.error('At least 2 employees are required for Secret Santa');
        return;
      }

      const assigner = new SecretSantaAssigner(employees, previousAssignments);
      const newAssignments = assigner.assign();
      setAssignments(newAssignments);
      toast.success('Secret Santa assignments generated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate assignments');
      console.error(error);
    }
  };

  const downloadAssignments = () => {
    if (assignments.length === 0) {
      toast.error('No assignments to download');
      return;
    }

    const csv = Papa.unparse(assignments);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'secret_santa_assignments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <Gift className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secret Santa Assigner</h1>
          <p className="text-gray-600">Upload your employee data and generate Secret Santa assignments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div {...getEmployeesRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <input {...getEmployeesInputProps()} />
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Drop employee CSV file here</p>
            <p className="text-sm text-gray-500 mt-2">Required columns: Employee_Name, Employee_EmailID</p>
            <p className="text-sm text-gray-500 mt-1">({employees.length} employees loaded)</p>
          </div>

          <div {...getPreviousRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <input {...getPreviousInputProps()} />
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Drop previous assignments CSV (optional)</p>
            <p className="text-sm text-gray-500 mt-2">Required columns: Employee_Name, Employee_EmailID, Secret_Child_Name, Secret_Child_EmailID</p>
            <p className="text-sm text-gray-500 mt-1">({previousAssignments.length} previous assignments loaded)</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={generateAssignments}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Generate Assignments
          </button>

          {assignments.length > 0 && (
            <button
              onClick={downloadAssignments}
              className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Assignments
            </button>
          )}
        </div>

        {assignments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Preview Assignments</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secret Child</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.Employee_Name}</div>
                        <div className="text-sm text-gray-500">{assignment.Employee_EmailID}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.Secret_Child_Name}</div>
                        <div className="text-sm text-gray-500">{assignment.Secret_Child_EmailID}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;