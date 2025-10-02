"use client";
import Table from "@/components/ui/Table";
import SearchInput from "@/components/SearchInput";
import CustomSelectInput from "@/components/ui/CustomSelectInput";
import React, { useState, useEffect } from "react";
import CreateDomainModal from "@/components/CreateDomainModal";
import EditDomainModal from "@/components/EditDomainModal";
import DeleteDomainModal from "@/components/DeleteDomainModal";
import useGetAllDomains from "@/hook/useGetAllDomains";
import Actions from "@/components/Actions";
import Domain_status from "@/utils/Domain_status";
import Activestatuslabel from "@/utils/Activestatuslabel";
import useDomainStore from "@/store/useDomainStore";
import useTypeStore from "@/store/useTypeStore";
import { useMutatecontroler } from "@/hook/useMutatecontroler"; 
import {
  POSTNEWDOMAIN,
  UPDATEDOMAINBYID,
  DELETEDOMAINBYID,
} from "@/services/httpMethode";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Home() {
  // Fetch domains data
  const { data, isLoading, mutate: refetchDomains } = useGetAllDomains();
  
  // Local state for UI interactions
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [domainToEdit, setDomainToEdit] = useState(null);
  const [domainToDelete, setDomainToDelete] = useState(null);
  
  // Form state for create modal
  const [newDomainData, setNewDomainData] = useState({
    domain: "",
    status: 1,
    isActive: true,
  });
  const INITIAL_DOMAIN_DATA = { domain: "", status: 1, isActive: true };

  // Zustand stores
  const { domains, setDomains, actions } = useDomainStore();
  const { getFilteredByType } = useTypeStore();

  // Router for navigation and refresh
  const router = useRouter();

  // Mutation hooks for CRUD operations
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

  // Sync domains from API to store on data change
  useEffect(() => {
    if (data?.results && Array.isArray(data.results)) {
      setDomains(data.results);
    }
  }, [data, setDomains]);

  // Handle create domain
  const handleCreateDomain = async () => {
    try {
      const newDomain = await createMutate(newDomainData);
      // Refetch to update data without manual state update to avoid duplicates
      await refetchDomains();
      setIsCreateModalOpen(false);
      setNewDomainData(INITIAL_DOMAIN_DATA);
      toast.success(`Domain "${newDomain.domain}" successfully added!`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.domain?.[0] ||
        error?.response?.data?.message ||
        "Failed to create domain.";
      toast.error(errorMessage);
    }
  };

  // Handle update domain
  const handleUpdateDomain = async (editedData) => {
    try {
      const updatedItem = await updateMutate(editedData);
      // Refetch to update data
      await refetchDomains();
      setIsEditModalOpen(false);
      setDomainToEdit(null);
      toast.success(`Domain "${updatedItem.domain}" successfully updated!`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update domain.";
      toast.error(errorMessage);
    }
  };

  // Handle delete domain
  const handleDeleteDomain = async () => {
    if (!domainToDelete) return;

    try {
      await deleteMutate(domainToDelete.id);
      // Refetch to update data without manual filtering to avoid inconsistencies
      await refetchDomains();
      setIsDeleteModalOpen(false);
      setDomainToDelete(null);
      toast.success(`Domain "${domainToDelete.domain}" successfully deleted!`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete domain."
      );
    }
  };

  // Handle search input change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle status filter change
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

  // Handle type filter change
  const handleTypeChange = (selected) => {
    setSelectedType(selected.value);
  };

  // Handle create modal form changes
  const handleModalDomainChange = (e) => {
    setNewDomainData({ ...newDomainData, domain: e.target.value });
  };

  const handleModalStatusChange = (selected) => {
    setNewDomainData({ ...newDomainData, status: selected.value });
  };

  const handleModalIsActiveChange = (selected) => {
    setNewDomainData({ ...newDomainData, isActive: selected.value });
  };

  // Handle modal open/close
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewDomainData(INITIAL_DOMAIN_DATA);
  };

  const handleOpenEditModal = (domainId) => {
    const domain = domains.find((d) => d.id === domainId);
    if (domain) {
      setDomainToEdit(domain);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setDomainToEdit(null);
  };

  const handleOpenDeleteModal = (domainId) => {
    const domain = domains.find((d) => d.id === domainId);
    if (domain) {
      setDomainToDelete(domain);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDomainToDelete(null);
  };

  // Filter domains based on search, status, and type
  const getFilteredDomains = () => {
    let filteredDomains = getFilteredByType(domains);

    // Apply search filter
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

  // Check if no results based on filters
  const showNoResults =
    filteredResults.length === 0 &&
    (searchQuery.trim() !== "" || selectedStatus !== "all" || selectedType !== "all");

  // Prepare table data: each row as array with all 5 columns
  const T_data = filteredResults.map((item) => [
    item.domain || "", // Domain column
    Domain_status(item.status), // Status column
    Activestatuslabel(item.isActive), // Active column
    item.createdDate || "", // Created column
    <Actions
      key={item.id}
      id={item.id}
      onEdit={() => handleOpenEditModal(item.id)}
      onDelete={() => handleOpenDeleteModal(item.id)}
    />, // Actions column
  ]);

  // Table headers: ensure all 5 are defined
  const T_header = ["Domain", "Status", "Active", "Created", "Actions"];

  // Select options
  const statusOptions = [
    { value: "all", label: "Status: All" },
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  const typeOptions = [
    { value: "all", label: "Type: All" },
    { value: 1, label: "pending" },
    { value: 2, label: "verified" },
    { value: 3, label: "rejected" },
  ];

  const modalStatusOptions = [
    { value: 1, label: "pending" },
    { value: 2, label: "verified" },
    { value: 3, label: "rejected" },
  ];

  const modalIsActiveOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-10 font-sans text-gray-900">
      {/* Create Modal */}
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

      {/* Edit Modal */}
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

      {/* Delete Modal */}
      {domainToDelete && (
        <DeleteDomainModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteDomain}
          domainName={domainToDelete.domain}
          isDeleting={deleteLoading}
        />
      )}

      {/* Header */}
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

      {/* Main Content */}
      <main className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Filters */}
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
            <div className="w-full xs:w-[calc(50%-6px)] sm:w-48">
              <CustomSelectInput
                label="Status: All"
                items={statusOptions}
                onSelected={handleStatusChange}
                value={{ value: selectedStatus, label: statusOptions.find(opt => opt.value === selectedStatus)?.label || "Status: All" }}
              />
            </div>

            <div className="w-full xs:w-[calc(50%-6px)] sm:w-48">
              <CustomSelectInput
                label="Type: All"
                items={typeOptions}
                onSelected={handleTypeChange}
                value={{ value: selectedType, label: typeOptions.find(opt => opt.value === selectedType)?.label || "Type: All" }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
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