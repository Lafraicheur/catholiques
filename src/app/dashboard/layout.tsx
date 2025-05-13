import { ReactNode } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}