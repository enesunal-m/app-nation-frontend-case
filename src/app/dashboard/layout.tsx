import dynamic from 'next/dynamic';

// Import the dashboard layout component with dynamic import to ensure it runs on the client
const DashboardLayout = dynamic(() => import('@/components/layouts/Dashboard'), {
  ssr: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}