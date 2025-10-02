import { create } from 'zustand';

// Creates a Zustand store to manage the selected domain type filter.
const useTypeStore = create((set, get) => ({
  selectedType: "all", // The current filter value (default is "all").

  // Setter function: updates the selected filter type in the store.
  setSelectedType: (type) => set({ selectedType: type }),

  // Getter function: filters the provided list of domains based on the selected type.
  getFilteredByType: (domains) => {
    const { selectedType } = get(); // Get the current filter value.

    // If filter is "all", return the full list.
    if (selectedType === "all") {
      return domains;
    }

    // Otherwise, filter domains where the domain's status matches the selected type.
    return domains.filter((domain) => domain.status === selectedType);
  },
}));

export default useTypeStore;