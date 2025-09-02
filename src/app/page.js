'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Notification from '../components/Notification';
import PlanCard from '../components/PlanCard';
import TopBar from '../components/TopBar';
import APIKeyTable from '../components/APIKeyTable';
import APIKeyModal from '../components/APIKeyModal';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApiKeys } from '../hooks/useApiKeys';
import { useFormData } from '../hooks/useFormData';
import { useModalState } from '../hooks/useModalState';
import { useSidebar } from '../hooks/useSidebar';
import { validateApiKeyForm } from '../utils/validation';

export default function Dashboard() {
  const { apiKeys, loading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();
  const { formData, updateFormData, resetFormData, populateFormData, togglePermission } = useFormData();
  const { 
    showCreateForm, 
    editingKey, 
    viewingKey, 
    isModalOpen, 
    openCreateModal, 
    openEditModal, 
    openViewModal, 
    closeAllModals 
  } = useModalState();
  const { sidebarVisible, toggleSidebar } = useSidebar();

  const handleCreate = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateApiKeyForm(formData);
    if (validationErrors.length > 0) {
      window.showToastNotification(validationErrors.join(', '), 'error');
      return;
    }
    
    const result = await createApiKey(formData);
    if (result.success) {
      closeAllModals();
      resetFormData();
      window.showToastNotification('API key created successfully!', 'success');
    } else {
      window.showToastNotification(result.error, 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateApiKeyForm(formData);
    if (validationErrors.length > 0) {
      window.showToastNotification(validationErrors.join(', '), 'error');
      return;
    }
    
    const result = await updateApiKey(editingKey.id, formData);
    if (result.success) {
      closeAllModals();
      resetFormData();
      window.showToastNotification('API key updated successfully!', 'success');
    } else {
      window.showToastNotification(result.error, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      const result = await deleteApiKey(id);
      if (result.success) {
        window.showToastNotification('API key deleted successfully!', 'success');
      } else {
        window.showToastNotification(result.error, 'error');
      }
    }
  };

  const handleEdit = (key) => {
    populateFormData(key);
    openEditModal(key);
  };

  const handleView = (key) => {
    populateFormData(key);
    openViewModal(key);
  };

  const handleModalClose = () => {
    closeAllModals();
    resetFormData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Backdrop */}
      {sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => toggleSidebar()}
        />
      )}
      
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="fixed md:relative z-50 md:z-auto">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopBar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />

        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6">
          <PlanCard />

          {/* API Keys Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                <button
                  onClick={openCreateModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                The key is used to authenticate your requests to the Research API. To learn more, see the{' '}
                <Link href="/docs" className="text-blue-600 hover:underline">documentation page</Link>.
              </p>
            </div>
            <APIKeyTable 
              apiKeys={apiKeys}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <ContactSection />
        </div>

        <Footer />
      </div>

      {/* Create/Edit/View Modal */}
      <APIKeyModal
        isOpen={isModalOpen}
        showCreateForm={showCreateForm}
        editingKey={editingKey}
        viewingKey={viewingKey}
        formData={formData}
        onClose={handleModalClose}
        onSubmit={editingKey ? handleUpdate : handleCreate}
        onFormDataChange={updateFormData}
        onTogglePermission={togglePermission}
      />

      {/* Notification Component */}
      <Notification />
    </div>
  );
}