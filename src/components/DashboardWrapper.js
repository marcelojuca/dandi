'use client'

import Link from 'next/link';
import Sidebar from './Sidebar';
import Notification from './Notification';
import PlanCard from './PlanCard';
import TopBar from './TopBar';
import APIKeyTable from './APIKeyTable';
import APIKeyModal from './APIKeyModal';
import ContactSection from './ContactSection';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import GoogleLoginButton from './GoogleLoginButton';
import UserProfile from './UserProfile';
import { useApiKeys } from '../hooks/useApiKeys';
import { useFormData } from '../hooks/useFormData';
import { useModalState } from '../hooks/useModalState';
import { useSidebar } from '../hooks/useSidebar';
import { useAuth } from '../contexts/AuthContext';
import { validateApiKeyForm } from '../utils/validation';

export default function DashboardWrapper() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
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

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Welcome to API Key Manager
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Sign in with your Google account to access the dashboard
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <GoogleLoginButton className="w-full" />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
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
          <div className="bg-card rounded-xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-card-foreground">API Keys</h3>
                <button
                  onClick={openCreateModal}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-muted-foreground mt-2">
                The key is used to authenticate your requests to the Research API. To learn more, see the{' '}
                <Link href="/docs" className="text-primary hover:underline">documentation page</Link>.
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
