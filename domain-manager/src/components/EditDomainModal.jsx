"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import CustomSelectInput from "@/components/ui/CustomSelectInput";

// EditDomainModal component for updating domain information.
function EditDomainModal({
  isOpen,
  onClose,
  onUpdate,
  initialDomainData, // The existing data of the domain being edited
  statusOptions,
  isActiveOptions,
  isUpdating = false, // Loading state from the mutation hook
}) {
  // State to hold the data currently being edited in the form.
  const [editedDomainData, setEditedDomainData] = useState(initialDomainData);
  // State to hold validation errors.
  const [errors, setErrors] = useState({});

  // Effect to initialize or reset the form data when the domain to edit changes.
  useEffect(() => {
    if (initialDomainData) {
      setEditedDomainData(initialDomainData);
    }
  }, [initialDomainData]);

  // Effect to clear errors when the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  // Handler for changes in the domain input field.
  const handleDomainChange = (e) => {
    setEditedDomainData({ ...editedDomainData, domain: e.target.value });
  };

  // Handler for changes in the Status select input.
  const handleStatusChange = (selected) => {
    setEditedDomainData({ ...editedDomainData, status: selected.value });
  };

  // Handler for changes in the IsActive select input.
  const handleIsActiveChange = (selected) => {
    setEditedDomainData({ ...editedDomainData, isActive: selected.value });
  };

  // Function to validate form fields.
  const validate = () => {
    const newErrors = {};

    // Regex for basic domain format validation (www.something.com)
    const domainRegex = /^www\..+\.com$/i;
    if (!editedDomainData.domain.trim()) {
      newErrors.domain = "Domain name is required.";
    } else if (!domainRegex.test(editedDomainData.domain)) {
      newErrors.domain = "Domain must start with 'www.' and end with '.com'.";
    }

    // Check for Status requirement.
    if (!editedDomainData.status || editedDomainData.status === null) {
      newErrors.status = "Status is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handler for the Update button click.
  const handleModalUpdate = () => {
    // Validate data before calling the update function.
    if (validate()) {
      onUpdate(editedDomainData); // Call parent update function
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onCreate={handleModalUpdate} // 'onCreate' is repurposed as 'onUpdate'
        title="Edit Domain"
        createButtonText={isUpdating ? "Updating..." : "Update"}
        isCreateButtonDisabled={isUpdating}
      >
        <div className="space-y-5">
          {/* Domain Input Field */}
          <div>
            <label
              htmlFor="modal-domain"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Domain
            </label>
            <input
              id="modal-domain"
              type="text"
              value={editedDomainData.domain}
              onChange={handleDomainChange}
              placeholder="Enter domain name"
              // Dynamic styling based on validation errors
              className={`w-full p-3 border rounded-lg shadow-sm transition duration-150 ${
                errors.domain
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {errors.domain && (
              <p className="mt-1 text-sm text-red-500">{errors.domain}</p>
            )}
          </div>

          {/* Status Select Input */}
          <div>
            <label
              htmlFor="modal-status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <CustomSelectInput
              // Determine the current selected label based on value
              label={
                statusOptions.find(
                  (opt) => opt.value === editedDomainData.status
                )?.label || "Select Status"
              }
              items={statusOptions}
              onSelected={handleStatusChange}
              className={errors.status ? "border-red-500" : ""} // Apply error styling
            />
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* IsActive Select Input */}
          <div>
            <label
              htmlFor="modal-active"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              IsActive
            </label>
            <CustomSelectInput
              // Determine the current selected label based on value
              label={
                isActiveOptions.find(
                  (opt) => opt.value === editedDomainData.isActive
                )?.label || "Select Active Status"
              }
              items={isActiveOptions}
              onSelected={handleIsActiveChange}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditDomainModal;