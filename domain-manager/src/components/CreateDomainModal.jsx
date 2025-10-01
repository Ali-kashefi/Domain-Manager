"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import CustomSelectInput from "@/components/ui/CustomSelectInput";

function CreateDomainModal({
  isOpen,
  onClose,
  onCreate,
  newDomainData,
  handleDomainChange,
  handleStatusChange,
  handleIsActiveChange,
  statusOptions,
  isActiveOptions,
  isCreating = false,
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    const domainRegex = /^www\..+\.com$/i;
    if (!newDomainData.domain.trim()) {
      newErrors.domain = "Domain name is required.";
    } else if (!domainRegex.test(newDomainData.domain)) {
      newErrors.domain = "Domain must start with 'www.' and end with '.com'.";
    }

    if (!newDomainData.status || newDomainData.status === null) {
      newErrors.status = "Status is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalCreate = () => {
    if (validate()) {
      onCreate();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onCreate={handleModalCreate}
        title="Add Domain"
        createButtonText={isCreating ? "Adding..." : "Add"}
        isCreateButtonDisabled={isCreating}
      >
        <div className="space-y-5">
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
              value={newDomainData.domain}
              onChange={handleDomainChange}
              placeholder="Enter domain name"
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

          <div>
            <label
              htmlFor="modal-status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <CustomSelectInput
              label={
                statusOptions.find((opt) => opt.value === newDomainData.status)
                  ?.label || "Select Status"
              }
              items={statusOptions}
              onSelected={handleStatusChange}
              className={errors.status ? "border-red-500" : ""}
            />
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="modal-active"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              IsActive
            </label>
            <CustomSelectInput
              label={
                isActiveOptions.find(
                  (opt) => opt.value === newDomainData.isActive
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

export default CreateDomainModal;