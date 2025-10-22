import Form from "@/components/dashboard/CreateUpdate";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/prisma/prisma";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function UpdatesPage({ params }: PageProps) {
  "use server"  
  const { slug } = await params;
  const updates = await prisma.updates.findMany({
    where: {
      incidentId: slug
    }
  })


    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-evenly">
          <h1 className="text-6xl font-bold">Post a new update</h1>
          <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
            <Form slug={slug} />
              
            <ScrollArea className="rounded-xl p-8 border-2 border-slate-200">
              <h2 className="text-2xl font-semibold mb-4">Existing Updates</h2>
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {updates.map((update) => (
                  <li key={update.id} className="border-b pb-4">
                    <p className="text-gray-700">{update.message}</p>
                    <p className="text-sm text-gray-500 mt-2">Posted at: {new Date(update.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
    )
}