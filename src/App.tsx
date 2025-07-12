import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pod, CreatePodFormData } from "./types";
import { mockPods } from "./utils/mockData";
import { useModal } from "./hooks/useModal";
import Hero from "./components/Hero";
import SearchFilter from "./components/SearchFilter";
import PodGrid from "./components/PodGrid";
import CreatePodModal from "./components/CreatePodModal";
import PodDetail from "./components/PodDetail";
import PerformanceDebugger from "./components/PerformanceDebugger";
import ShareModal from "./components/ShareModal";
import { getPods, getPodById } from "./hooks/usePod";
import { getUserSessionId } from "./utils/cookieUtils";

// Shared Pod Page Component
const SharedPodPage: React.FC = () => {
  const { podId } = useParams<{ podId: string }>();
  const navigate = useNavigate();
  const [pod, setPod] = useState<PodResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPod = async () => {
      if (!podId) {
        setError("No pod ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const podData = await getPodById(podId);
        setPod(podData);
        setError(null);
      } catch (err) {
        console.error("Error fetching pod:", err);
        setError("Pod not found or failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchPod();
  }, [podId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Pod...
          </h1>
          <p className="text-gray-600">
            Please wait while we fetch the pod details.
          </p>
        </div>
      </div>
    );
  }

  if (error || !pod) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Pod Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === "No pod ID provided"
              ? "No pod ID was provided in the URL."
              : "The pod you're looking for doesn't exist or failed to load."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <PodDetail id={pod.id} onBack={() => navigate("/")} />;
};

// Home Page Component
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [pods, setPods] = useState<Pod[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("recent");
  const [showHero, setShowHero] = useState(true);
  const [shareModalPod, setShareModalPod] = useState<Pod | null>(null);

  // Moved useModal to top level - always called unconditionally
  const {
    isOpen: isCreateModalOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModal();

  useEffect(() => {
    const getData = async () => {
      const pods = await getPods();
      setPods(pods);
    };
    getData();
  }, []);

  // Filter and sort pods
  const filteredPods = useMemo(() => {
    if (!pods) return []; // Handle null case

    let filtered = pods.filter((pod) =>
      pod.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (filterOption) {
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "most-accessed":
        // filtered.sort((a, b) => b.interactions - a.interactions);
        break;
      case "category":
        // filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "recent":
      default:
        // filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [pods, searchQuery, filterOption]);

  const handleCreatePod = () => {
    openCreateModal();
  };

  const handlePodSubmit = (formData: CreatePodFormData) => {
    const newPod: Pod = {
      id: Date.now().toString(),
      title: formData.title,
      tags: ["Demo tags"],
      image: "image_path",
      //description: formData.description,
      //thumbnail: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      //category: 'General',
      //urls: formData.urls,
      //createdAt: new Date(),
      //interactions: 0,
      //followers: Math.floor(Math.random() * 100),
      //status: 'ready',
      //isFollowing: false
    };

    setPods((prev) => [newPod, ...prev]);
    setShowHero(false); // Hide hero only after successful pod creation
    closeCreateModal();
  };

  const handlePodClick = (pod: Pod) => {
    navigate(`/pod/${pod.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowHero(false);
    }
  };

  const handleFilter = (filter: string) => {
    setFilterOption(filter);
  };

  // Handle pod following
  const handleToggleFollow = (podId: string) => {
    setPods((prev) =>
      prev.map((pod) =>
        pod.id === podId
          ? {
              ...pod,
              //isFollowing: !pod.isFollowing,
              //followers: pod.isFollowing ? pod.followers - 1 : pod.followers + 1
            }
          : pod
      )
    );
  };

  // Handle pod sharing
  const handlePodShare = (pod: Pod) => {
    setShareModalPod(pod);
  };

  // Add function to show hero section
  const handleShowHero = () => {
    setShowHero(true);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onCreatePod={handleCreatePod} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onCreatePod={handleCreatePod}
        onShowHero={handleShowHero}
        showHero={showHero}
      />

      {/* Pod Grid */}
      <PodGrid
        pods={filteredPods}
        onPodClick={handlePodClick}
        onToggleFollow={handleToggleFollow}
        onShare={handlePodShare}
      />

      {/* Create Pod Modal */}
      <CreatePodModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handlePodSubmit}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={!!shareModalPod}
        onClose={() => setShareModalPod(null)}
        pod={shareModalPod!}
      />
    </>
  );
};

function App() {
  const [showPerformanceDebugger, setShowPerformanceDebugger] = useState(false);

  useEffect(() => {
    const sessionId = getUserSessionId();
    console.log("User Session ID:", sessionId);
    // You can now use this sessionId for tracking, analytics, or sending to your backend
    // For example, you might pass it to an analytics service or include it in API headers.
  }, []);

  // Performance debugging toggle (for development)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setShowPerformanceDebugger((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PerformanceDebugger enabled={showPerformanceDebugger} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pod/:podId" element={<SharedPodPage />} />
      </Routes>
    </div>
  );
}

export default App;
