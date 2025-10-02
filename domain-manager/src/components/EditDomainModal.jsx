"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import CustomSelectInput from "@/components/ui/CustomSelectInput";

function EditDomainModal({
  isOpen,
  onClose,
  onUpdate,
  initialDomainData,
  statusOptions,
  isActiveOptions,
  isUpdating = false,
}) {
  const [editedDomainData, setEditedDomainData] = useState(initialDomainData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialDomainData) {
      setEditedDomainData(initialDomainData);
    }
  }, [initialDomainData]);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const handleDomainChange = (e) => {
    setEditedDomainData({ ...editedDomainData, domain: e.target.value });
  };

  const handleStatusChange = (selected) => {
    setEditedDomainData({ ...editedDomainData, status: selected.value });
  };

  const handleIsActiveChange = (selected) => {
    setEditedDomainData({ ...editedDomainData, isActive: selected.value });
  };

  const validate = () => {
    const newErrors = {};

    const domainRegex = /^www\..+\.com$/i;
    if (!editedDomainData.domain.trim()) {
      newErrors.domain = "Domain name is required.";
    } else if (!domainRegex.test(editedDomainData.domain)) {
      newErrors.domain = "Domain must start with 'www.' and end with '.com'.";
    }

    if (!editedDomainData.status || editedDomainData.status === null) {
      newErrors.status = "Status is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalUpdate = () => {
    if (validate()) {
      onUpdate(editedDomainData);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onCreate={handleModalUpdate}
        title="Edit Domain"
        createButtonText={isUpdating ? "Updating..." : "Update"}
        isCreateButtonDisabled={isUpdating}
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
              value={editedDomainData.domain}
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
                statusOptions.find(
                  (opt) => opt.value === editedDomainData.status
                )?.label || "Select Status"
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