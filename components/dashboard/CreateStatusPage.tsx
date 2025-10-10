import { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { StatusPage } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface CreateStatusPageProps {
  onBack: () => void;
  onCreated: (page: StatusPage) => void;
}

export function CreateStatusPage({
  onBack,
  onCreated,
}: CreateStatusPageProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  // const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = authClient.useSession();

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const newPage: StatusPage = {
        id: crypto.randomUUID(),
        authorId: session?.user.id || "",
        title: name,
        slug,
        published: isPublic,
        createdAt: new Date(),
        updatedAt: new Date(),
        organizationId: null,
      };

      fetch("/api/statuspage", {
      method: "POST",
      body: JSON.stringify(newPage),
    }).then(async (res) => {
      setLoading(false);
      if (res.ok) {
        const incident = await res.json();
        onCreated(incident);
        toast.success("Status page created successfully");
      } else {
        // Handle error (e.g., show notification)
        console.error("Failed to create status page");
        toast.error("Failed to create status page");
      }
    }).catch((err) => {
      setLoading(false);
      console.error("Error creating status page:", err);
      toast.error("Error creating status page");
    });

      onCreated(newPage);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-600 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Create Status Page
              </h1>
              <p className="text-slate-600">
                Set up a new status page for your services
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Page Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="My Awesome Service"
              />
              <p className="text-sm text-slate-500 mt-1">
                The display name for your status page
              </p>
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">clearstatus.com/</span>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  required
                  pattern="[a-z0-9-]+"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="my-awesome-service"
                />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                URL-friendly identifier (lowercase, numbers, and hyphens only)
              </p>
            </div>

            {/* <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="A brief description of your services..."
              />
            </div> */}

            <div className="flex items-center gap-3">
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="isPublic" className="text-sm text-slate-700">
                Make this status page publicly accessible
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? "Creating..." : "Create Status Page"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
