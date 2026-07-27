import DefaultLayout from "@/components/layout/DefaultLayout";

export default function AthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout key={'menuAuthenticated'}>
      {children}
    </DefaultLayout>
  );
}