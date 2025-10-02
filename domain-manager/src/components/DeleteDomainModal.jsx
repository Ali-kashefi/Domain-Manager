"use client";
import Modal from "@/components/ui/Modal";

/**
 * DeleteDomainModal component for confirming domain deletion.
 *
 * It uses the generic Modal component, customizing it for a destructive action.
 *
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {function} onClose - Function to close the modal (e.g., when clicking Cancel).
 * @param {function} onDelete - Function to execute the deletion API call (passed from the parent).
 * @param {string} domainName - The name of the domain to be deleted, displayed for confirmation.
 * @param {boolean} [isDeleting=false] - State indicating if the API deletion process is currently loading.
 *
 * Note: The prop 'onCreate' on the Modal is repurposed here for the 'Delete' action.
 */
function DeleteDomainModal({
  isOpen,
  onClose,
  onDelete, 
  domainName, 
  isDeleting = false, 
}) {
  // Handler for the delete button inside the modal.
  const handleModalDelete = () => {
    // Calls the deletion logic passed from the parent component (Home).
    onDelete();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        // Reuses the 'onCreate' slot for the destructive 'Delete' action
        onCreate={handleModalDelete} 
        title="Delete Domain"
        createButtonText={isDeleting ? "Deleting..." : "Delete"}
        isCreateButtonDisabled={isDeleting}
        // Custom class to style the button red for warning/deletion
        createButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      >
        <div className="p-4 text-center">
          {/* Danger Icon (Warning Triangle) */}
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          {/* Confirmation Message */}
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Are you sure you want to delete the domain:
            <br />
            <strong className="text-red-600 break-words">{domainName}</strong>?
          </h3>
          {/* Warning */}
          <p className="mt-2 text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
}

export default DeleteDomainModal;