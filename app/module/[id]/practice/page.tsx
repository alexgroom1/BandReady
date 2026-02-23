import { ActivityScreen } from "@/components/screens/ActivityScreen";

export default function ActivityPage({
  params,
}: {
  params: { id: string };
}) {
  return <ActivityScreen moduleId={params.id} />;
}
