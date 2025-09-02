'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import Notification from '../../components/Notification';
import { useSidebar } from '../../hooks/useSidebar';

export default function Protected() {
  const [apiKeyData, setApiKeyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { sidebarVisible, toggleSidebar } = useSidebar();

  useEffect(() => {
    // Get the validated API key data from sessionStorage
    const storedData = sessionStorage.getItem('validatedApiKey');
    if (storedData) {
      try {
        setApiKeyData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored API key data:', error);
        window.showToastNotification('Invalid session data', 'error');
        router.push('/playground');
      }
    } else {
      window.showToastNotification('No valid session found', 'error');
      router.push('/playground');
    }
    setLoading(false);
  }, [router]);

  const handleBackToPlayground = () => {
    sessionStorage.removeItem('validatedApiKey');
    router.push('/playground');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!apiKeyData) {
    return null; // Will redirect in useEffect
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
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
            >
              {sidebarVisible ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Protected Area</h1>
          </div>
          <button
            onClick={handleBackToPlayground}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Playground
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800">API Key Validated Successfully</h3>
                  <p className="text-sm text-green-700">You have access to the protected area.</p>
                </div>
              </div>
            </div>

            {/* API Key Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">API Key Details</h2>
                <p className="text-gray-600 mt-1">View the details of your validated API key.</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Key Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Key Name
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                    {apiKeyData.name}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 min-h-[80px]">
                    {apiKeyData.description || 'No description provided'}
                  </div>
                </div>

                {/* Key Type */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Key Type
                  </label>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      apiKeyData.key_type === 'production' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {apiKeyData.key_type === 'production' ? 'Production' : 'Development'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {apiKeyData.key_type === 'production' 
                        ? 'Rate limited to 1,000 requests/minute' 
                        : 'Rate limited to 100 requests/minute'
                      }
                    </span>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['create', 'read', 'edit', 'delete', 'admin'].map((permission) => (
                      <div key={permission} className={`flex items-center p-3 border rounded-lg ${
                        apiKeyData.permissions && apiKeyData.permissions.includes(permission)
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className={`w-4 h-4 rounded border-2 mr-3 ${
                          apiKeyData.permissions && apiKeyData.permissions.includes(permission)
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {apiKeyData.permissions && apiKeyData.permissions.includes(permission) && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {permission}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Monthly Usage Limit
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 ${
                      apiKeyData.limit_usage 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {apiKeyData.limit_usage && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="text-sm text-gray-900">
                      {apiKeyData.limit_usage ? 'Limited' : 'Unlimited'}
                    </span>
                    {apiKeyData.limit_usage && (
                      <span className="text-sm text-gray-500">
                        ({apiKeyData.monthly_limit || 1000} requests/month)
                      </span>
                    )}
                  </div>
                </div>

                {/* API Key (Masked) */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    API Key
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono">
                    {apiKeyData.key ? `${apiKeyData.key.substring(0, 8)}************************` : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    For security reasons, the full API key is not displayed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Component */}
      <Notification />
    </div>
  );
}
