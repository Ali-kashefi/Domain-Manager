"use client";
import Table from "@/components/ui/Table";
import SearchInput from "@/components/SearchInput";
import CustomSelectInput from "@/components/ui/CustomSelectInput";
import React, { useState } from "react";
import useGetAllDomains from "@/hook/useGetAllDomains";
import Actions from "@/components/Actions";
import Domain_status from "@/utils/Domain_status";
import Activestatuslabel from "@/utils/Activestatuslabel";
import useDomainStore from "@/store/useDomainStore";
export default function Home() {
  const { data, isLoading, error } = useGetAllDomains();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { domains, setDomains, actions } = useDomainStore();

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
    let currentDomains = domains;

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

  const showNoResults =
    filteredResults.length === 0 &&
    (searchQuery.trim() !== "" || selectedStatus !== "all");

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10 font-sans text-gray-900">
      <header className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Domains
          </h1>
          <p className="text-sm text-gray-500">CRUD + Search & Filter</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-150">
          Add New
        </button>
      </header>

      <main className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="w-full sm:w-1/3">
            <SearchInput
              onChange={handleSearch}
              value={searchQuery}
              className="p-2 border border-gray-300 rounded-md w-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by domain..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <CustomSelectInput
                label="Status: All"
                items={statusOptions}
                onSelected={handleStatusChange}
              />
            </div>
            <div className="w-full sm:w-48">
              <CustomSelectInput
                label="Type: All"
                items={typeOptions}
                onSelected={handleTypeChange}
              />
            </div>
          </div>
        </div>

        {showNoResults ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 font-medium">
              No domains found.
            </p>
          </div>
        ) : (
          <Table
            className="w-full text-sm md:text-base border-collapse"
            columnStyle="p-3 border-b border-gray-100 text-gray-700 whitespace-nowrap"
            data={T_data}
            headers={T_header}
            headersStyle="p-3 bg-gray-50 text-gray-500 uppercase tracking-wider font-medium border-b border-gray-200 text-left"
          />
        )}
      </main>
    </div>
  );
}
