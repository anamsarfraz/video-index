import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pod, CreatePodFormData } from './types';
import { mockPods } from './utils/mockData';
import { useModal } from './hooks/useModal';
import Hero from './components/Hero';
import SearchFilter from './components/SearchFilter';
import PodGrid from './components/PodGrid';
import CreatePodModal from './components/CreatePodModal';
import PodDetail from './components/PodDetail';
import PerformanceDebugger from './components/PerformanceDebugger';
import ShareModal from './components/ShareModal';

type AppView = 'home' | 'pod-detail';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
  const [pods, setPods] = useState<Pod[]>(mockPods);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('recent');
  const [showHero, setShowHero] = useState(true);
  const [showPerformanceDebugger, setShowPerformanceDebugger] = useState(false);
  const [shareModalPod, setShareModalPod] = useState<Pod | null>(null);
  
  const { isOpen: isCreateModalOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();

  // Filter and sort pods
  const filteredPods = useMemo(() => {
    let filtered = pods.filter(pod =>
      pod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (filterOption) {
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'most-accessed':
        filtered.sort((a, b) => b.interactions - a.interactions);
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      description: formData.description,
      thumbnail: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      category: 'General',
      urls: formData.urls,
      createdAt: new Date(),
      interactions: 0
    };

    setPods(prev => [newPod, ...prev]);
    setShowHero(false); // Hide hero only after successful pod creation
    closeCreateModal();
  };

  const handlePodClick = (pod: Pod) => {
    setSelectedPod(pod);
    setCurrentView('pod-detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPod(null);
    // Scroll to top to show hero section
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setPods(prev => 
      prev.map(pod => 
        pod.id === podId 
          ? { 
              ...pod, 
              isFollowing: !pod.isFollowing,
              followers: pod.isFollowing ? pod.followers - 1 : pod.followers + 1
            }
          : pod
      )
    );
  };

  // Add function to show hero section
  const handleShowHero = () => {
    setShowHero(true);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle pod sharing
  const handlePodShare = (pod: Pod) => {
    setShareModalPod(pod);
  };

  // Performance debugging toggle (for development)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setShowPerformanceDebugger(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <PerformanceDebugger enabled={showPerformanceDebugger} />
      
      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <AnimatePresence>
              {showHero && (
                <motion.div
                  initial={{ opacity: 1, height: 'auto' }}
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
          </motion.div>
        ) : (
          <motion.div
            key="pod-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedPod && (
              <PodDetail
                pod={selectedPod}
                onBack={handleBackToHome}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
}

export default App;