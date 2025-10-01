"use client";
import Table from "@/components/ui/Table";
import Searach from "@/components/Searach";
import CustomSelectInput from "@/components/ui/CustomSelectInput";
import React from "react";
import useGetAllDomains from "@/hook/useGetAllDomains";
import Actions from "@/components/Actions";
import Domain_status from "@/utils/Domain_status";
import Activestatuslabel from "@/utils/Activestatuslabel";

export default function Home() {
  const { data, isLoading, error } = useGetAllDomains();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  const domainResults =
    data?.results && Array.isArray(data.results) ? data.results : [];

  const T_data = domainResults.map((resultItem, index) => {
    return [
      resultItem.domain,
      <p>{Domain_status(resultItem.status)}</p>,
      Activestatuslabel(resultItem.isActive),

      resultItem.createdDate,
      <Actions key={index} id={resultItem.id} />,
    ];
  });

  const T_header = ["Domain", "Status", "Active", "Created", "Actions"];

  const statusOptions = [
    { value: "all", label: "Status: All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
  ];

  const typeOptions = [
    { value: "all", label: "Type: All" },
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
  ];

  const handleStatusChange = (selected) => {
    console.log("Selected Status:", selected);
  };

  const handleTypeChange = (selected) => {
    console.log("Selected Type:", selected);
  };

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
            <Searach
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

        <Table
          className="w-full text-sm md:text-base border-collapse"
          columnStyle="p-3 border-b border-gray-100 text-gray-700 whitespace-nowrap"
          data={T_data}
          headers={T_header}
          headersStyle="p-3 bg-gray-50 text-gray-500 uppercase tracking-wider font-medium border-b border-gray-200 text-left"
        />
      </main>
    </div>
  );
}
