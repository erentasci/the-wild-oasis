import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: (user) => {
      console.log("User: ", user);
      queryClient.setQueriesData(["user"], user);
      toast.success("Logout successfully");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.log("ERROR: ", error.message);
      toast.error("Provided email or password is incorrect. Please try again.");
    },
  });

  return { logout, isLoading };
}
