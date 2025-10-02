"use client";

// External libraries and components
import Table from "@/components/ui/Table";
import SearchInput from "@/components/SearchInput";
import CustomSelectInput from "@/components/ui/CustomSelectInput";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Custom modals and components
import CreateDomainModal from "@/components/CreateDomainModal";
import EditDomainModal from "@/components/EditDomainModal";
import DeleteDomainModal from "@/components/DeleteDomainModal";
import Actions from "@/components/Actions";

// Hooks and utilities
import useGetAllDomains from "@/hook/useGetAllDomains";
import { useMutatecontroler } from "@/hook/useMutatecontroler";
import useDomainStore from "@/store/useDomainStore";
import useTypeStore from "@/store/useTypeStore";
import Domain_status from "@/utils/Domain_status";
import Activestatuslabel from "@/utils/Activestatuslabel";

// API services
import {
  POSTNEWDOMAIN,
  UPDATEDOMAINBYID,
  DELETEDOMAINBYID,
} from "@/services/httpMethode";

/**
 * Main Home component for managing domains.
 * Handles CRUD operations, search, and filtering.
 */
export default function Home() {
  // ==================== DATA FETCHING ====================
  /**
   * Fetch all domains using the custom hook.
   * data: Contains the fetched domains.
   * isLoading: Loading state for the initial fetch.
   */
  const { data, isLoading } = useGetAllDomains();

  // ==================== STATE MANAGEMENT ====================
  /**
   * Local states for UI interactions.
   */
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [selectedStatus, setSelectedStatus] = useState("all"); // Status filter (all, true, false)

  /**
   * Modal control states.
   */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Controls create modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls edit modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controls delete modal visibility
  const [domainToEdit, setDomainToEdit] = useState(null); // Domain object to edit
  const [domainToDelete, setDomainToDelete] = useState(null); // Domain object to delete

  /**
   * Form state for the create modal.
   */
  const [newDomainData, setNewDomainData] = useState({
    domain: "",
    status: 1,
    isActive: true,
  });
  const INITIAL_DOMAIN_DATA = { domain: "", status: 1, isActive: true }; // Reset values for create form

  /**
   * Zustand stores for global state management.
   * domains: List of all domains.
   * setDomains: Updater for domains list.
   * actions: Filter actions for status (all, active, inactive).
   * selectedType: Current type filter value.
   * setSelectedType: Updater for type filter.
   * getFilteredByType: Filters domains by type.
   */
  const { domains, setDomains, actions } = useDomainStore();
  const { selectedType, setSelectedType, getFilteredByType } = useTypeStore();

  // ==================== HOOKS ====================
  /**
   * Router hook for navigation and page refresh.
   */
  const router = useRouter();

  /**
   * Mutation hooks for CRUD operations using the custom mutate controller.
   * Each returns isLoading and mutate function for the specific API.
   */
  const {
    isLoading: createLoading,
    mutate: createMutate,
  } = useMutatecontroler({
    Api: POSTNEWDOMAIN,
  });

  const {
    isLoading: updateLoading,
    mutate: updateMutate,
  } = useMutatecontroler({
    Api: UPDATEDOMAINBYID,
  });

  const {
    isLoading: deleteLoading,
    mutate: deleteMutate,
  } = useMutatecontroler({
    Api: DELETEDOMAINBYID,
  });

  // ==================== EFFECTS ====================
  /**
   * Sync fetched data from API to Zustand store whenever data changes.
   * Ensures the store is always up-to-date with the latest API response.
   */
  useEffect(() => {
    if (data?.results && Array.isArray(data.results)) {
      setDomains(data.results);
    }
  }, [data, setDomains]);

  // ==================== HANDLERS ====================
  /**
   * ==================== CREATE HANDLERS ====================
   */

  /**
   * Handle form input changes in the create modal.
   */
  const handleModalDomainChange = (e) => {
    setNewDomainData({ ...newDomainData, domain: e.target.value });
  };

  const handleModalStatusChange = (selected) => {
    setNewDomainData({ ...newDomainData, status: selected.value });
  };

  const handleModalIsActiveChange = (selected) => {
    setNewDomainData({ ...newDomainData, isActive: selected.value });
  };

  /**
   * Open the create modal.
   */
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);

  /**
   * Close the create modal and reset form data.
   */
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewDomainData(INITIAL_DOMAIN_DATA);
  };

  /**
   * Submit the create form: Calls API, refreshes page, closes modal, shows toast.
   */
  const handleCreateDomain = async () => {
    try {
      const newDomain = await createMutate(newDomainData);
      // Refresh the page to fetch updated data from server
      router.refresh();
      setIsCreateModalOpen(false);
      setNewDomainData(INITIAL_DOMAIN_DATA);
      toast.success(`Domain "${newDomain?.domain || 'Unknown'}" successfully added!`);
    } catch (error) {
      console.error("❌ Error in handleCreateDomain:", error);
      const errorMessage =
        error?.response?.data?.domain?.[0] ||
        error?.response?.data?.message ||
        "Failed to create domain.";
      toast.error(errorMessage);
    }
  };

  /**
   * ==================== EDIT HANDLERS ====================
   */

  /**
   * Open the edit modal with the selected domain data.
   */
  const handleOpenEditModal = (domainId) => {
    const domain = domains.find((d) => d.id === domainId);
    if (domain) {
      setDomainToEdit(domain);
      setIsEditModalOpen(true);
    }
  };

  /**
   * Close the edit modal and clear selected domain.
   */
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setDomainToEdit(null);
  };

  /**
   * Submit the edit form: Calls API, refreshes page, closes modal, shows toast.
   */
  const handleUpdateDomain = async (editedData) => {
    try {
      const updatedItem = await updateMutate(editedData);
      // Refresh the page to fetch updated data from server
      router.refresh();
      setIsEditModalOpen(false);
      setDomainToEdit(null);
      toast.success(`Domain "${updatedItem?.domain || 'Unknown'}" successfully updated!`);
    } catch (error) {
      console.error("❌ Error in handleUpdateDomain:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to update domain.";
      toast.error(errorMessage);
    }
  };

  /**
   * ==================== DELETE HANDLERS ====================
   */

  /**
   * Open the delete modal with the selected domain data.
   */
  const handleOpenDeleteModal = (domainId) => {
    const domain = domains.find((d) => d.id === domainId);
    if (domain) {
      setDomainToDelete(domain);
      setIsDeleteModalOpen(true);
    }
  };

  /**
   * Close the delete modal and clear selected domain.
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDomainToDelete(null);
  };

  /**
   * Submit the delete action: Calls API, refreshes page, closes modal, shows toast.
   */
  const handleDeleteDomain = async () => {
    if (!domainToDelete) return;

    try {
      await deleteMutate(domainToDelete.id);
      // Refresh the page to fetch updated data from server
      router.refresh();
      setIsDeleteModalOpen(false);
      setDomainToDelete(null);
      toast.success(`Domain "${domainToDelete.domain}" successfully deleted!`);
    } catch (error) {
      console.error("❌ Error in handleDeleteDomain:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete domain."
      );
    }
  };

  /**
   * ==================== FILTER & SEARCH HANDLERS ====================
   */

  /**
   * Handle search input changes.
   */
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  /**
   * Handle status filter changes and update store actions.
   */
  const handleStatusChange = (selected) => {
    const statusValue = selected.value;
    setSelectedStatus(statusValue);

    if (statusValue === "all") {
      actions.all();
    } else if (statusValue === true) {
      actions.active();
    } else if (statusValue === false) {
      actions.inactive();
    }
  };

  /**
   * Handle type filter changes.
   */
  const handleTypeChange = (selected) => {
    setSelectedType(selected.value);
  };

  /**
   * ==================== UTILITY FUNCTIONS ====================
   */

  /**
   * Filter domains based on type (from store), then apply search query.
   * Returns the filtered list of domains.
   */
  const getFilteredDomains = () => {
    let filteredDomains = getFilteredByType(domains);

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredDomains = filteredDomains.filter((domain) => {
        const domainName = domain.domain?.toLowerCase() || "";
        const createdDate = domain.createdDate ? String(domain.createdDate).toLowerCase() : "";
        return domainName.includes(query) || createdDate.includes(query);
      });
    }

    return filteredDomains;
  };

  const filteredResults = getFilteredDomains();

  /**
   * Check if no results are found due to active filters/search.
   */
  const showNoResults =
    filteredResults.length === 0 &&
    (searchQuery.trim() !== "" || selectedStatus !== "all" || selectedType !== "all");

  /**
   * Prepare table data: Map filtered domains to rows with 5 columns.
   * Each row: [domain, status, active, createdDate, actions component]
   */
  const T_data = filteredResults.map((item) => [
    item.domain || "", // Domain name
    Domain_status(item.status), // Formatted status
    Activestatuslabel(item.isActive), // Active label
    item.createdDate || "", // Creation date
    <Actions
      key={item.id}
      id={item.id}
      onEdit={() => handleOpenEditModal(item.id)}
      onDelete={() => handleOpenDeleteModal(item.id)}
    />, // Action buttons
  ]);

  /**
   * Table headers for the 5 columns.
   */
  const T_header = ["Domain", "Status", "Active", "Created", "Actions"];

  /**
   * ==================== OPTIONS ====================
   */

  /**
   * Options for status filter dropdown.
   */
  const statusOptions = [
    { value: "all", label: "Status: All" },
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  /**
   * Options for type filter dropdown.
   */
  const typeOptions = [
    { value: "all", label: "Type: All" },
    { value: 1, label: "pending" },
    { value: 2, label: "verified" },
    { value: 3, label: "rejected" },
  ];

  /**
   * Options for status in modals.
   */
  const modalStatusOptions = [
    { value: 1, label: "pending" },
    { value: 2, label: "verified" },
    { value: 3, label: "rejected" },
  ];

  /**
   * Options for isActive in modals.
   */
  const modalIsActiveOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  // ==================== RENDERING ====================
  /**
   * Show loading spinner while fetching initial data.
   */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-10 font-sans text-gray-900">
      {/* ==================== MODALS ==================== */}

      {/* Create Domain Modal */}
      <CreateDomainModal
        handleDomainChange={handleModalDomainChange}
        handleIsActiveChange={handleModalIsActiveChange}
        handleStatusChange={handleModalStatusChange}
        isActiveOptions={modalIsActiveOptions}
        isOpen={isCreateModalOpen}
        newDomainData={newDomainData}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateDomain}
        statusOptions={modalStatusOptions}
        isCreating={createLoading}
      />

      {/* Edit Domain Modal - Conditionally render when domainToEdit exists */}
      {domainToEdit && (
        <EditDomainModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateDomain}
          initialDomainData={domainToEdit}
          statusOptions={modalStatusOptions}
          isActiveOptions={modalIsActiveOptions}
          isUpdating={updateLoading}
        />
      )}

      {/* Delete Domain Modal - Conditionally render when domainToDelete exists */}
      {domainToDelete && (
        <DeleteDomainModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteDomain}
          domainName={domainToDelete.domain}
          isDeleting={deleteLoading}
        />
      )}

      {/* ==================== HEADER ==================== */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 border-b pb-4 sm:pb-0">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Domains
          </h1>
          <p className="text-sm text-gray-500 mt-1">CRUD + Search & Filter</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto bg-black text-white px-5 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:scale-[1.02]"
          disabled={createLoading}
        >
          {createLoading ? "Creating..." : "Add New"}
        </button>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Filters Section: Search and dropdowns */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-1/3 lg:w-72">
            <SearchInput
              onChange={handleSearch}
              value={searchQuery}
              className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Search by domain, date..."
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            {/* Status Filter Dropdown */}
            <div className="w-full xs:w-[calc(50%-6px)] sm:w-48">
              <CustomSelectInput
                label="Status: All"
                items={statusOptions}
                onSelected={handleStatusChange}
                value={{ 
                  value: selectedStatus, 
                  label: statusOptions.find(opt => opt.value === selectedStatus)?.label || "Status: All" 
                }}
              />
            </div>

            {/* Type Filter Dropdown */}
            <div className="w-full xs:w-[calc(50%-6px)] sm:w-48">
              <CustomSelectInput
                label="Type: All"
                items={typeOptions}
                onSelected={handleTypeChange}
                value={{ 
                  value: selectedType, 
                  label: typeOptions.find(opt => opt.value === selectedType)?.label || "Type: All" 
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {showNoResults ? (
            <div className="text-center py-16 bg-white">
              <p className="text-xl text-gray-500 font-medium">
                No domains found matching your criteria. 😔
              </p>
            </div>
          ) : (
            <Table
              className="w-full min-w-[700px] text-sm md:text-base border-collapse"
              columnStyle="p-4 border-b border-gray-100 text-gray-700 whitespace-nowrap align-middle"
              data={T_data}
              headers={T_header}
              headersStyle="p-4 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200 text-left sticky top-0"
            />
          )}
        </div>
      </main>
    </div>
  );
}