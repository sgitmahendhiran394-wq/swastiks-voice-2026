import { useEffect, useState } from "react";

export type Employee = {
  id: string;
  name: string;
  firstName: string;
  email: string;
  employeeId: string | null;
  department: string | null;
  avatarUrl: string | null;
};

const STORAGE_KEY = "swastiks_employee_session";

export function useAuth() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEmployee(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (details: Omit<Employee, "id" | "firstName" | "avatarUrl">) => {
    const firstName = details.name.split(/\s+/)[0] ?? details.name;
    const newEmployee: Employee = {
      ...details,
      id: crypto.randomUUID(),
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      department: details.department || null,
      avatarUrl: null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEmployee));
    setEmployee(newEmployee);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEmployee(null);
  };

  return {
    employee,
    loading,
    isAuthenticated: !!employee,
    login,
    logout,
  };
}
