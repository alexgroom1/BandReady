import { ModuleIntroScreen } from "@/components/screens/ModuleIntroScreen";

export default function ModuleIntroPage({
  params,
}: {
  params: { id: string };
}) {
  return <ModuleIntroScreen moduleId={params.id} />;
}
