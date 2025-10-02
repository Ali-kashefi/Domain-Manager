// 🛠️ Custom Hook: useMutatecontroler
// 🎯 Purpose: A reusable mutation handler using React Query
// 🚀 Features:
// - Handles API mutations dynamically
// - Provides mutation state: data, isLoading, error
// - Offers an async `mutate` function for executing API calls
// - Implements error handling for debugging
// ✅ Usage:
//   const { data, isLoading, error, mutate } = useMutatecontroler({ Api: sendOTPAPI });
//   mutate({ phoneNumber: "09366017982" });
import { useMutation } from "@tanstack/react-query";
export function useMutatecontroler({ Api }) {
      const { data, isPending: isLoading, error, mutateAsync } = useMutation({
        mutationFn: Api
    });
    const mutate = async (parametr) => {
        try {
            const response = await mutateAsync(parametr);
            return response;
        } catch (error) {
            console.log("Error:", error);
            console.log("Parametr at error:", parametr);
        }
    };
    return { data, isLoading, error, mutate };
}
