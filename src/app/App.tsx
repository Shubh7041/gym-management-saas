import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/common/PageHeader";

function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Gym Management SaaS"
          description="Design system preview"
          action={<Button>Add Member</Button>}
        />

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Foundation
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Our reusable UI components are working correctly.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Primary</Button>

            <Button variant="secondary">
              Secondary
            </Button>

            <Button variant="outline">
              Outline
            </Button>

            <Button variant="danger">
              Delete
            </Button>

            <Button variant="ghost">
              Ghost
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default App;