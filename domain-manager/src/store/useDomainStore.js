import { create } from 'zustand';

// Creates a Zustand store to manage domain data and filtering logic.
const useDomainStore = create((set, get) => ({
  domains: [],          // The currently displayed/filtered list of domains.
  originalDomains: [],  // The complete, unfiltered list of domains fetched from the API. 

  actions: {
    // Action to filter domains and show only active ones.
    active: () => {
      set((state) => {
        const activeDomains = state.originalDomains.filter(
          (domain) => domain.isActive === true
        );
        return { 
          ...state, 
          domains: activeDomains // Update the displayed list.
        };
      });
    },
    // Action to filter domains and show only inactive ones.
    inactive: () => {
      set((state) => {
        const inactiveDomains = state.originalDomains.filter(
          (domain) => domain.isActive === false
        );
        return { 
          ...state, 
          domains: inactiveDomains // Update the displayed list.
        };
      });
    },
    // Action to reset the displayed list to all original domains.
    all: () => {
      set((state) => ({ 
        ...state, 
        domains: state.originalDomains // Use the full list.
      }));
    }
  },
  // Setter function: updates both the displayed and the original list.
  setDomains: (domains) => set({ domains, originalDomains: domains }),
  // Getter function: returns the currently displayed list.
  getFilteredDomains: () => get().domains 
}));

export default useDomainStore