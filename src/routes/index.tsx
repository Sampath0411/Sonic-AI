import { createFileRoute } from "@tanstack/react-router";
import { BackgroundPaths } from "@/components/ui/background-paths";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <BackgroundPaths title="Sonic AI" />;
}
