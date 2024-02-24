import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      console.log("User: ", user);
      queryClient.setQueriesData(["user"], user);
      toast.success("Login successfully");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.log("ERROR: ", error.message);
      toast.error("Provided email or password is incorrect. Please try again.");
    },
  });

  return { login, isLoading };
}
