"use client";
import Table from "@/components/ui/Table";
import SearchInput from "@/components/SearchInput";

import CustomSelectInput from "@/components/ui/CustomSelectInput";
import React, { useState } from "react";
import CreateDomainModal from "@/components/CreateDomainModal";
import useGetAllDomains from "@/hook/useGetAllDomains";
import Actions from "@/components/Actions";
import Domain_status from "@/utils/Domain_status";
import Activestatuslabel from "@/utils/Activestatuslabel";
import useDomainStore from "@/store/useDomainStore";
import useTypeStore from "@/store/useTypeStore";

export default function Home() {
  const { data, isLoading, error } = useGetAllDomains();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isOpen, setIsModalOpen] = useState(false);
  const { domains, setDomains, actions } = useDomainStore();
  const { selectedType, setSelectedType, getFilteredByType } = useTypeStore();

  const [newDomainData, setNewDomainData] = useState({
    domain: "",
    status: 1,
    isActive: true,
  });

  const modalStatusOptions = [
    { value: 1, label: "pending" },
    { value: 2, label: "verified" },
    { value: 3, label: "rejected" },
  ];

  const modalIsActiveOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  const handleModalDomainChange = (e) => {
    setNewDomainData({ ...newDomainData, domain: e.target.value });
  };

  const handleModalStatusChange = (selected) => {
    setNewDomainData({ ...newDomainData, status: selected.value });
  };

  const handleModalIsActiveChange = (selected) => {
    setNewDomainData({ ...newDomainData, isActive: selected.value });
  };

  const handleCreateDomain = () => {
    console.log("Create button clicked. Data:", newDomainData);
  };

  React.useEffect(() => {
    if (data?.results && Array.isArray(data.results)) {
      setDomains(data.results);
    }
  }, [data, setDomains]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  const getFilteredDomains = () => {
    let currentDomains = getFilteredByType(domains);

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      currentDomains = currentDomains.filter((domain) => {
        const nameValue = domain.domain ? domain.domain.toLowerCase() : "";
        let dateValue = "";
        if (domain.createdDate !== null && domain.createdDate !== undefined) {
          dateValue = String(domain.createdDate).toLowerCase();
        }
        const isMatchInName = nameValue.includes(query);
        const isMatchInDate = dateValue.includes(query);

        return isMatchInName || isMatchInDate;
      });
    }

    return currentDomains;
  };

  const filteredResults = getFilteredDomains();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

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

  const handleTypeChange = (selected) => {
    console.log("Selected Type:", selected);
    setSelectedType(selected.value);
  };

  const T_data = filteredResults.map((resultItem, index) => {
    return [
      resultItem.domain,
      Domain_status(resultItem.status),
      Activestatuslabel(resultItem.isActive),
      resultItem.createdDate,
      <Actions id={resultItem.id} />,
    ];
  });

  const T_header = ["Domain", "Status", "Active", "Created", "Actions"];

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
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const showNoResults =
    filteredResults.length === 0 &&
    (searchQuery.trim() !== "" ||
      selectedStatus !== "all" ||
      selectedType !== "all");

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-10 font-sans text-gray-900">
      <CreateDomainModal
        handleDomainChange={handleModalDomainChange}
        handleIsActiveChange={handleModalIsActiveChange}
        handleStatusChange={handleModalStatusChange}
        isActiveOptions={modalIsActiveOptions}
        isOpen={isOpen} // ✅ تصحیح شد: باید مقدار بولی باشد، نه تابع
        newDomainData={newDomainData} // ✅ تصحیح شد: باید شیء حالت باشد
        onClose={handleClose}
        onCreate={handleCreateDomain}
        statusOptions={modalStatusOptions}
      />
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 border-b pb-4 sm:pb-0">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Domains
          </h1>
          <p className="text-sm text-gray-500 mt-1">CRUD + Search & Filter</p>
        </div>
        <button
          onClick={handleOpen}
          className="w-full sm:w-auto bg-black text-white px-5 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:scale-[1.02]"
        >
          Add New
        </button>
      </header>

      <main className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
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
              />
            </div>

            <div className="w-full xs:w-[calc(50%-6px)] sm:w-48">
              <CustomSelectInput
                label="Type: All"
                items={typeOptions}
                onSelected={handleTypeChange}
              />
            </div>
          </div>
        </div>

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
