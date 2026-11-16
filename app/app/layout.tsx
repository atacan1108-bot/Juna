import TabBar from "@/components/TabBar";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="app-stage">
      <div className="app">
        {children}
        <TabBar />
      </div>
    </div>
  );
}
