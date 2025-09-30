"use client";
import Table from "@/components/ui/Table";
import Searach from "@/components/Searach";
import CustomSelectInput from "@/components/ui/CustomSelectInput";
import React from 'react'; 


export default function Home() {
  const T_header = ["Domain", "Status", "Active", "Created", "Actions"];
  

  const T_data = [
    ["example-domain-1.com", "Active", "Yes", "2024-09-01", (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-150">Edit</button>
        <button className="text-red-600 hover:text-red-800 transition-colors duration-150">Delete</button>
      </div>
    )],
    ["another-domain-2.net", "Inactive", "No", "2024-09-05", (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-150">Edit</button>
        <button className="text-red-600 hover:text-red-800 transition-colors duration-150">Delete</button>
      </div>
    )],
    ["example.org", "Active", "Yes", "2024-09-10", (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-150">Edit</button>
        <button className="text-red-600 hover:text-red-800 transition-colors duration-150">Delete</button>
      </div>
    )],
  ];

  // Options for the filter dropdowns (CustomSelectInput)
  const statusOptions = [
    { value: 'all', label: 'Status: All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];

  const typeOptions = [
    { value: 'all', label: 'Type: All' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
  ];

  const handleStatusChange = (selected) => {
    console.log("Selected Status:", selected);
    // Implement status filtering logic
  };

  const handleTypeChange = (selected) => {
    console.log("Selected Type:", selected);
    // Implement type filtering logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10 font-sans text-gray-900">
      <header className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Domains</h1>
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