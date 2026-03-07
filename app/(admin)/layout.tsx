export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {/* CMS Sidebar/Header can go here */}
      <main>{children}</main>
    </div>
  );
}
