"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { StatusPage } from "@/types";
import { Plus, Activity, LogOut, LayoutDashboard } from "lucide-react";
import { StatusPageManager } from "@/components/dashboard/StatusPageManager";
import { CreateStatusPage } from "@/components/dashboard/CreateStatusPage";
import type { User } from "better-auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {

  const [statusPages, setStatusPages] = useState<StatusPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<StatusPage | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    data: session,
    isPending, //loading state
  } = authClient.useSession();
  const [user, setUser] = useState<User | null>();
  const [checkers, setCheckers] = useState<string[]>([]);
  
  const router = useRouter()

  useEffect(() => {
    loadStatusPages();
    if (isPending == false) {
      setUser(session?.user ?? null);
    }
    loadEnabledCheckers();
  }, [isPending, statusPages.length]);

  const loadStatusPages = async () => {
    fetch("/api/statuspage", {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: ["statuspages"],
      }
    })
      .then(async (res) => {
        if (res.ok) {
          const pages = await res.json();
          setStatusPages(pages);
          setLoading(false);
        } else {
          setStatusPages([]);
          setLoading(false);
          if(res.status == 401) {
            router.push("/login")
          }
        }
      })
      .catch((err) => {
        console.error("Error loading status pages:", err);
        setStatusPages([]);
        setLoading(false);
      });
  };
  function loadEnabledCheckers() {
    fetch("/api/config/allowedCheckers")
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setCheckers(data.checkers);
        }
      })
      .catch((err) => {
        console.error("Error loading allowed checkers:", err);
      });
  }
  const handlePageCreated = (page: {
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    authorId: string;
    organizationId: string | null;
    description?: string;
  }) => {
    // Convert Date fields to string to match StatusPage type
    const normalizedPage: StatusPage = {
      ...page,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    };
    setStatusPages([...statusPages, normalizedPage]);
    setShowCreate(false);
    setSelectedPage(normalizedPage);
  };

  if (showCreate) {
    return (
      <CreateStatusPage
        onBack={() => setShowCreate(false)}
        onCreated={handlePageCreated}
      />
    );
  }

  if (selectedPage) {
    return (
      <StatusPageManager
        checkers={checkers}
        statusPage={selectedPage}
        onBack={() => setSelectedPage(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">ClearStatus</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              <button
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/";
                      },
                    },
                  })
                }
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Your Status Pages
              </h2>
              <p className="text-slate-600 mt-1">
                Manage and monitor your services
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Status Page
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : statusPages.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 p-4 rounded-full">
                <LayoutDashboard className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No status pages yet
            </h3>
            <p className="text-slate-600 mb-6">
              Create your first status page to start monitoring your services
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Your First Status Page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page)}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors">
                    <Activity className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      page.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {page.published ? "Public" : "Private"}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  {page.title}
                </h3>
                {page.description && (
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {page.description}
                  </p>
                )}
                <div className="text-sm text-slate-500">/{page.slug}</div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
