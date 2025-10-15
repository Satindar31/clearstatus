import Form from "@/components/dashboard/CreateUpdate";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function UpdatesPage({ params }: PageProps) {
    const { slug } = await params;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-evenly">
          <h1 className="text-6xl font-bold">Post a new update</h1>
          <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
            <Form slug={slug} />
              Add sort of timeline of updates here...
          </div>
        </div>
    )
}