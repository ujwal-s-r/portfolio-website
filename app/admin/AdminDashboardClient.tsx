"use client";

import { useState } from "react";
import Link from "next/link";
import {
  loginAdmin,
  logoutAdmin,
  saveProject,
  deleteProject,
  reorderProjects,
  saveExperience,
  deleteExperience,
  reorderExperiences,
  saveNowItem,
  deleteNowItem,
  reorderNowItems,
  saveSkillGroup,
  deleteSkillGroup,
  reorderSkillGroups,
  saveLinkedInPost,
  deleteLinkedInPost,
  reorderLinkedInPosts,
} from "@/app/actions/admin";
import type { ProjectItem } from "@/app/lib/projects";
import type { ExperienceItem } from "@/app/lib/experience";
import type { NowItem, SkillGroup } from "@/app/lib/now";
import type { LinkedInPostItem } from "@/app/lib/linkedin";

interface AdminDashboardClientProps {
  initialAuthenticated: boolean;
  projects: ProjectItem[];
  research: ProjectItem[];
  experiences: ExperienceItem[];
  nowBuilding: NowItem[];
  nowLearning: NowItem[];
  skillGroups: SkillGroup[];
  linkedInPosts: LinkedInPostItem[];
}

type TabType = "projects" | "research" | "experience" | "now" | "skills" | "linkedin";

export default function AdminDashboardClient({
  initialAuthenticated,
  projects: initialProjects,
  research: initialResearch,
  experiences: initialExperiences,
  nowBuilding: initialNowBuilding,
  nowLearning: initialNowLearning,
  skillGroups: initialSkillGroups,
  linkedInPosts: initialLinkedInPosts,
}: AdminDashboardClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Local state for instant optimistic UI
  const [projectsList, setProjectsList] = useState(initialProjects);
  const [researchList, setResearchList] = useState(initialResearch);
  const [expList, setExpList] = useState(initialExperiences);
  const [buildingList, setBuildingList] = useState(initialNowBuilding);
  const [learningList, setLearningList] = useState(initialNowLearning);
  const [skillsList, setSkillsList] = useState(initialSkillGroups);
  const [postsList, setPostsList] = useState(initialLinkedInPosts);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    const res = await loginAdmin(passcode);
    setIsSubmitting(false);
    if (res.success) {
      setIsAuthenticated(true);
      showToast("Signed in successfully");
    } else {
      setAuthError(res.error || "Invalid passcode");
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    showToast("Signed out");
  };

  // Reordering Helpers
  const moveItem = async (list: any[], setList: Function, index: number, direction: "up" | "down", reorderAction: Function) => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const updated = [...list];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setList(updated);

    const reorderPayload = updated.map((item, i) => ({
      id: item.id,
      orderIndex: i + 1,
    }));

    await reorderAction(reorderPayload);
    showToast("Order updated!");
  };

  // Open Edit Form
  const openNewItem = () => {
    if (activeTab === "projects" || activeTab === "research") {
      setEditingItem({
        id: "",
        slug: "",
        title: "",
        tag: activeTab === "projects" ? "Project" : "LLM Research",
        category: activeTab,
        description: "",
        techStackStr: "",
        pointsStr: "",
        image: "",
        orderIndex: (activeTab === "projects" ? projectsList.length : researchList.length) + 1,
        featured: false,
        ongoing: false,
        status: "completed",
        github: "",
        linkedin: "",
        link: "",
        event: "",
      });
    } else if (activeTab === "experience") {
      setEditingItem({
        id: "",
        slug: "",
        company: "",
        role: "",
        location: "",
        period: "",
        orderIndex: expList.length + 1,
        pointsStr: "",
      });
    } else if (activeTab === "now") {
      setEditingItem({
        id: "",
        slug: "",
        title: "",
        category: "BUILDING",
        status: "ACTIVE",
        techStackStr: "",
        github: "",
        orderIndex: buildingList.length + 1,
        description: "",
      });
    } else if (activeTab === "skills") {
      setEditingItem({
        id: "",
        category: "",
        skillsStr: "",
        orderIndex: skillsList.length + 1,
      });
    } else if (activeTab === "linkedin") {
      setEditingItem({
        id: "",
        slug: "",
        title: "",
        image: "",
        link: "",
        orderIndex: postsList.length + 1,
        text: "",
      });
    }
    setIsEditorOpen(true);
  };

  const openEditItem = (item: any) => {
    if (activeTab === "projects" || activeTab === "research") {
      setEditingItem({
        ...item,
        slug: item.id,
        category: activeTab,
        techStackStr: Array.isArray(item.techStack) ? item.techStack.join(", ") : "",
        pointsStr: Array.isArray(item.points) ? item.points.join("\n\n") : "",
      });
    } else if (activeTab === "experience") {
      setEditingItem({
        ...item,
        slug: item.id,
        pointsStr: Array.isArray(item.points) ? item.points.join("\n\n") : "",
      });
    } else if (activeTab === "now") {
      setEditingItem({
        ...item,
        slug: item.id,
        techStackStr: Array.isArray(item.techStack) ? item.techStack.join(", ") : "",
      });
    } else if (activeTab === "skills") {
      setEditingItem({
        ...item,
        skillsStr: Array.isArray(item.skills) ? item.skills.join(", ") : "",
      });
    } else if (activeTab === "linkedin") {
      setEditingItem({
        ...item,
        slug: item.id,
      });
    }
    setIsEditorOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeTab === "projects" || activeTab === "research") {
        const techStack = editingItem.techStackStr
          ? editingItem.techStackStr.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        const points = editingItem.pointsStr
          ? editingItem.pointsStr.split("\n\n").map((s: string) => s.trim()).filter(Boolean)
          : [];

        const payload = {
          id: editingItem.id || `${activeTab}-${editingItem.slug || Date.now()}`,
          slug: editingItem.slug || editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: editingItem.title,
          tag: editingItem.tag || "Project",
          description: editingItem.description || "",
          category: activeTab as "projects" | "research",
          techStack,
          points,
          image: editingItem.image || null,
          orderIndex: Number(editingItem.orderIndex) || 99,
          featured: Boolean(editingItem.featured),
          ongoing: Boolean(editingItem.ongoing),
          status: editingItem.ongoing ? "ongoing" : editingItem.status || "completed",
          github: editingItem.github || "",
          linkedin: editingItem.linkedin || "",
          link: editingItem.link || "",
          event: editingItem.event || "",
        };

        await saveProject(payload);

        if (activeTab === "projects") {
          setProjectsList((prev) => {
            const idx = prev.findIndex((p) => p.id === payload.id || p.id === payload.slug);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = { ...payload, id: payload.slug };
              return updated;
            }
            return [...prev, { ...payload, id: payload.slug }];
          });
        } else {
          setResearchList((prev) => {
            const idx = prev.findIndex((p) => p.id === payload.id || p.id === payload.slug);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = { ...payload, id: payload.slug };
              return updated;
            }
            return [...prev, { ...payload, id: payload.slug }];
          });
        }
      } else if (activeTab === "experience") {
        const points = editingItem.pointsStr
          ? editingItem.pointsStr.split("\n\n").map((s: string) => s.trim()).filter(Boolean)
          : [];
        const payload = {
          id: editingItem.id || editingItem.slug || Date.now().toString(),
          slug: editingItem.slug || editingItem.company.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          company: editingItem.company,
          role: editingItem.role,
          location: editingItem.location || "",
          period: editingItem.period || "",
          orderIndex: Number(editingItem.orderIndex) || 99,
          points,
        };
        await saveExperience(payload);
        setExpList((prev) => {
          const idx = prev.findIndex((e) => e.id === payload.id || e.id === payload.slug);
          if (idx >= 0) {
            const u = [...prev];
            u[idx] = { ...payload, id: payload.slug, order: payload.orderIndex };
            return u;
          }
          return [...prev, { ...payload, id: payload.slug, order: payload.orderIndex }];
        });
      } else if (activeTab === "now") {
        const techStack = editingItem.techStackStr
          ? editingItem.techStackStr.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        const payload = {
          id: editingItem.id || `${editingItem.category.toLowerCase()}-${editingItem.slug || Date.now()}`,
          slug: editingItem.slug || editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: editingItem.title,
          category: editingItem.category as "BUILDING" | "LEARNING",
          status: editingItem.status || "ACTIVE",
          techStack,
          github: editingItem.github || "",
          orderIndex: Number(editingItem.orderIndex) || 99,
          description: editingItem.description || "",
        };
        await saveNowItem(payload);
        if (payload.category === "BUILDING") {
          setBuildingList((prev) => [...prev.filter((p) => p.id !== payload.slug), { ...payload, id: payload.slug, order: payload.orderIndex }]);
        } else {
          setLearningList((prev) => [...prev.filter((p) => p.id !== payload.slug), { ...payload, id: payload.slug, order: payload.orderIndex }]);
        }
      } else if (activeTab === "skills") {
        const skills = editingItem.skillsStr
          ? editingItem.skillsStr.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        const payload = {
          id: editingItem.id || editingItem.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          category: editingItem.category,
          skills,
          orderIndex: Number(editingItem.orderIndex) || 99,
        };
        await saveSkillGroup(payload);
        setSkillsList((prev) => [...prev.filter((s) => s.id !== payload.id), payload]);
      } else if (activeTab === "linkedin") {
        const payload = {
          id: editingItem.id || editingItem.slug || Date.now().toString(),
          slug: editingItem.slug || editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: editingItem.title,
          image: editingItem.image || "",
          link: editingItem.link || "",
          orderIndex: Number(editingItem.orderIndex) || 99,
          text: editingItem.text || "",
        };
        await saveLinkedInPost(payload);
        setPostsList((prev) => [...prev.filter((p) => p.id !== payload.slug), { ...payload, id: payload.slug, order: payload.orderIndex }]);
      }

      showToast("Saved successfully! 🎉");
      setIsEditorOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Error saving item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setIsSubmitting(true);
    try {
      if (activeTab === "projects") {
        await deleteProject(id);
        setProjectsList((prev) => prev.filter((p) => p.id !== id));
      } else if (activeTab === "research") {
        await deleteProject(id);
        setResearchList((prev) => prev.filter((p) => p.id !== id));
      } else if (activeTab === "experience") {
        await deleteExperience(id);
        setExpList((prev) => prev.filter((p) => p.id !== id));
      } else if (activeTab === "now") {
        await deleteNowItem(id);
        setBuildingList((prev) => prev.filter((p) => p.id !== id));
        setLearningList((prev) => prev.filter((p) => p.id !== id));
      } else if (activeTab === "skills") {
        await deleteSkillGroup(id);
        setSkillsList((prev) => prev.filter((p) => p.id !== id));
      } else if (activeTab === "linkedin") {
        await deleteLinkedInPost(id);
        setPostsList((prev) => prev.filter((p) => p.id !== id));
      }
      showToast("Deleted item");
    } catch {
      showToast("Error deleting item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "cover" | "content"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (target === "cover") {
          setEditingItem((prev: any) => ({ ...prev, image: data.url }));
          showToast("Cover image uploaded! 🖼️");
        } else {
          const caption = prompt("Enter a short image caption/label:") || "Project Architecture";
          const snippet = `\n\n![${caption}|large](${data.url})`;
          setEditingItem((prev: any) => ({
            ...prev,
            pointsStr: (prev.pointsStr ? prev.pointsStr + snippet : snippet.trim()),
          }));
          showToast("Image inserted into content! 🖼️");
        }
      } else {
        showToast(data.error || "Upload failed");
      }
    } catch {
      showToast("Upload failed");
    }
  };

  // =============================================================
  // PASSCODE LOGIN SCREEN
  // =============================================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">
              Protected Area
            </span>
            <h1 className="font-serif text-3xl font-normal text-white">
              Admin Portal
            </h1>
            <p className="font-mono text-xs text-white/40 mt-1">
              Enter admin passcode configured in your .env
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full bg-white/[0.04] border border-white/15 focus:border-emerald-500/60 focus:outline-none rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-white/20 transition-all"
                autoFocus
              />
              {authError && (
                <p className="mt-2 font-mono text-xs text-red-400">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs uppercase tracking-[0.14em] font-semibold rounded-xl transition-all disabled:opacity-40"
            >
              {isSubmitting ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="font-mono text-xs text-white/30 hover:text-white transition-colors"
            >
              ← Return to Portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =============================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =============================================================
  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-10 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-xl font-mono text-xs shadow-2xl backdrop-blur-md animate-bounce">
          {notification}
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Top Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-medium text-white">
                Admin Control
              </h1>
              <span className="font-mono text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Live DB
              </span>
            </div>
            <p className="font-mono text-xs text-white/40 mt-1">
              Manage projects, research, career milestones & content instantly
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white font-mono text-xs tracking-wider transition-all"
            >
              Live Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs tracking-wider transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { key: "projects", label: "Projects", count: projectsList.length },
            { key: "research", label: "Research", count: researchList.length },
            { key: "experience", label: "Experience", count: expList.length },
            { key: "now", label: "Now (Building/Learning)", count: buildingList.length + learningList.length },
            { key: "skills", label: "Skills", count: skillsList.length },
            { key: "linkedin", label: "LinkedIn Posts", count: postsList.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as TabType);
                setSearch("");
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-white text-black font-semibold shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.key ? "bg-black/15 text-black" : "bg-white/10 text-white/40"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Action Header: Search & Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.03] border border-white/15 focus:border-emerald-500/50 focus:outline-none rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-white/30 sm:w-80"
          />

          <button
            onClick={openNewItem}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          >
            + Add New {activeTab === "now" ? "Now Item" : activeTab === "skills" ? "Skill Group" : activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Content Lists */}
        <div className="space-y-3">
          {/* 1. PROJECTS & RESEARCH */}
          {(activeTab === "projects" || activeTab === "research") && (
            (activeTab === "projects" ? projectsList : researchList)
              .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tag.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx, arr) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#090909] hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Order Controls */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveItem(
                          activeTab === "projects" ? projectsList : researchList,
                          activeTab === "projects" ? setProjectsList : setResearchList,
                          idx,
                          "up",
                          reorderProjects
                        )}
                        disabled={idx === 0}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▲
                      </button>
                      <span className="font-mono text-[10px] text-white/40">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => moveItem(
                          activeTab === "projects" ? projectsList : researchList,
                          activeTab === "projects" ? setProjectsList : setResearchList,
                          idx,
                          "down",
                          reorderProjects
                        )}
                        disabled={idx === arr.length - 1}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Thumbnail */}
                    {item.image ? (
                      <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/20 shrink-0 font-mono text-[10px]">
                        N/A
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-white truncate">
                          {item.title}
                        </span>
                        {item.ongoing && (
                          <span className="font-mono text-[9px] uppercase px-2 py-0.2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shrink-0">
                            ● Ongoing
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-white/40 mt-1">
                        <span className="text-emerald-400/80">{item.tag}</span>
                        <span>•</span>
                        <span>{item.points.length} Deliverables</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditItem(item)}
                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs text-white/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 font-mono text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* 2. EXPERIENCE */}
          {activeTab === "experience" && (
            expList
              .filter((e) => !search || e.company.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx, arr) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#090909] hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveItem(expList, setExpList, idx, "up", reorderExperiences)}
                        disabled={idx === 0}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▲
                      </button>
                      <span className="font-mono text-[10px] text-white/40">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => moveItem(expList, setExpList, idx, "down", reorderExperiences)}
                        disabled={idx === arr.length - 1}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg text-white">{item.company}</h3>
                      <p className="font-mono text-xs text-white/50">{item.role} · {item.period} · {item.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditItem(item)}
                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs text-white/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 font-mono text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* 3. NOW SECTION (BUILDING & LEARNING) */}
          {activeTab === "now" && (
            <div className="space-y-8">
              {/* BUILDING SUB-SECTION */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400">
                    Building ({buildingList.length})
                  </h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="space-y-3">
                  {buildingList
                    .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()))
                    .map((item, idx, arr) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#090909] hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => moveItem(buildingList, setBuildingList, idx, "up", reorderNowItems)}
                              disabled={idx === 0}
                              className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                            >
                              ▲
                            </button>
                            <span className="font-mono text-[10px] text-white/40">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <button
                              onClick={() => moveItem(buildingList, setBuildingList, idx, "down", reorderNowItems)}
                              disabled={idx === arr.length - 1}
                              className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                            >
                              ▼
                            </button>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-base text-white">{item.title}</span>
                              <span className="font-mono text-[9px] uppercase px-2 py-0.2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                {item.status || "ACTIVE"}
                              </span>
                            </div>
                            <p className="font-mono text-xs text-white/40 mt-1 line-clamp-1">{item.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openEditItem(item)}
                            className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs text-white/80"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 font-mono text-xs text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* LEARNING SUB-SECTION */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400">
                    Learning ({learningList.length})
                  </h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="space-y-3">
                  {learningList
                    .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()))
                    .map((item, idx, arr) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#090909] hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => moveItem(learningList, setLearningList, idx, "up", reorderNowItems)}
                              disabled={idx === 0}
                              className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                            >
                              ▲
                            </button>
                            <span className="font-mono text-[10px] text-white/40">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <button
                              onClick={() => moveItem(learningList, setLearningList, idx, "down", reorderNowItems)}
                              disabled={idx === arr.length - 1}
                              className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                            >
                              ▼
                            </button>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-base text-white">{item.title}</span>
                              <span className="font-mono text-[9px] uppercase px-2 py-0.2 rounded-full border border-white/15 bg-white/[0.04] text-white/60">
                                {item.category}
                              </span>
                            </div>
                            <p className="font-mono text-xs text-white/40 mt-1 line-clamp-1">{item.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openEditItem(item)}
                            className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs text-white/80"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 font-mono text-xs text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. SKILLS */}
          {activeTab === "skills" && (
            skillsList
              .filter((s) => !search || s.category.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx, arr) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#090909] hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveItem(skillsList, setSkillsList, idx, "up", reorderSkillGroups)}
                        disabled={idx === 0}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▲
                      </button>
                      <span className="font-mono text-[10px] text-white/40">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => moveItem(skillsList, setSkillsList, idx, "down", reorderSkillGroups)}
                        disabled={idx === arr.length - 1}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    <div>
                      <h3 className="font-serif text-base text-white">{item.category}</h3>
                      <p className="font-mono text-xs text-white/50 mt-1">{item.skills.join(" · ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditItem(item)}
                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs text-white/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 font-mono text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* 5. LINKEDIN POSTS */}
          {activeTab === "linkedin" && (
            postsList
              .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx, arr) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#090909] hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveItem(postsList, setPostsList, idx, "up", reorderLinkedInPosts)}
                        disabled={idx === 0}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▲
                      </button>
                      <span className="font-mono text-[10px] text-white/40">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => moveItem(postsList, setPostsList, idx, "down", reorderLinkedInPosts)}
                        disabled={idx === arr.length - 1}
                        className="text-white/30 hover:text-white disabled:opacity-10 text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    <div>
                      <h3 className="font-serif text-base text-white">{item.title}</h3>
                      <p className="font-mono text-xs text-white/50 mt-1 line-clamp-1">{item.text}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditItem(item)}
                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs text-white/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 font-mono text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* =============================================================
          EDITOR MODAL DIALOG
      ============================================================= */}
      {isEditorOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0e0e0e] border border-white/15 rounded-2xl p-6 sm:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-serif text-2xl text-white">
                {editingItem.id ? `Edit ${activeTab}` : `New ${activeTab}`}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-white/40 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Common Title & Slug */}
              {(activeTab === "projects" || activeTab === "research" || activeTab === "now" || activeTab === "linkedin") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-emerald-500/60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Slug (URL key)
                    </label>
                    <input
                      type="text"
                      value={editingItem.slug || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                      placeholder="e.g. 01-my-project"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-emerald-500/60"
                    />
                  </div>
                </div>
              )}

              {/* Projects & Research Specifics */}
              {(activeTab === "projects" || activeTab === "research") && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        Tag (Domain)
                      </label>
                      <input
                        type="text"
                        value={editingItem.tag || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-emerald-500/60"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                          Cover Image
                        </label>
                        <label className="cursor-pointer font-mono text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">
                          📁 Upload Cover
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "cover")}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={editingItem.image || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        placeholder="/uploads/... or /info/projects/...jpg"
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-emerald-500/60"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingItem.ongoing)}
                          onChange={(e) => setEditingItem({ ...editingItem, ongoing: e.target.checked })}
                          className="accent-emerald-500 h-4 w-4 rounded"
                        />
                        <span className="font-mono text-xs text-white/80">● Ongoing</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        GitHub Repo
                      </label>
                      <input
                        type="text"
                        value={editingItem.github || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, github: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        LinkedIn Post
                      </label>
                      <input
                        type="text"
                        value={editingItem.linkedin || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, linkedin: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={editingItem.link || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Tech Stack (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={editingItem.techStackStr || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, techStackStr: e.target.value })}
                      placeholder="PyTorch, FastAPI, Next.js, TypeScript"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                        Content Points & Images (Markdown)
                      </label>
                      <label className="cursor-pointer font-mono text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        + Upload & Insert Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "content")}
                        />
                      </label>
                    </div>
                    <textarea
                      rows={8}
                      value={editingItem.pointsStr || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, pointsStr: e.target.value })}
                      placeholder="- **Built** a distributed pipeline...&#10;&#10;![System Architecture|large](/info/projects/diagram.png)"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3 font-mono text-xs text-white leading-relaxed"
                    />
                  </div>
                </>
              )}

              {/* Experience Specifics */}
              {activeTab === "experience" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.company || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.role || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        Period
                      </label>
                      <input
                        type="text"
                        value={editingItem.period || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                        placeholder="Jan 2024 – Present"
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editingItem.location || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                        placeholder="Bengaluru, India"
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Deliverables & Contributions (Separate with double newline)
                    </label>
                    <textarea
                      rows={6}
                      value={editingItem.pointsStr || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, pointsStr: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3 font-mono text-xs text-white"
                    />
                  </div>
                </>
              )}

              {/* Skills Specifics */}
              {activeTab === "skills" && (
                <>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.category || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      placeholder="e.g. Deep Learning & LLMs"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Skills List (Comma separated)
                    </label>
                    <textarea
                      rows={4}
                      value={editingItem.skillsStr || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, skillsStr: e.target.value })}
                      placeholder="PyTorch, Transformers, LangChain, CUDA"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3 font-mono text-xs text-white"
                    />
                  </div>
                </>
              )}

              {/* Now Item Specifics */}
              {activeTab === "now" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        Category
                      </label>
                      <select
                        value={editingItem.category || "BUILDING"}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      >
                        <option value="BUILDING" className="bg-black">BUILDING</option>
                        <option value="LEARNING" className="bg-black">LEARNING</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                        GitHub Link (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingItem.github || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, github: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Tech Stack (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={editingItem.techStackStr || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, techStackStr: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={editingItem.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3 font-mono text-xs text-white"
                    />
                  </div>
                </>
              )}

              {/* LinkedIn Specifics */}
              {activeTab === "linkedin" && (
                <>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Post URL Link
                    </label>
                    <input
                      type="text"
                      value={editingItem.link || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                      Post Body Text
                    </label>
                    <textarea
                      rows={5}
                      value={editingItem.text || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3 font-mono text-xs text-white"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 font-mono text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition-all"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
