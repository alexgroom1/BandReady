import { AssessmentScreen } from "@/components/screens/AssessmentScreen";

export default function AssessmentPage({
  params,
}: {
  params: { id: string };
}) {
  return <AssessmentScreen moduleId={params.id} />;
}
