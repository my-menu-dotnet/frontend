import { Category } from "@/@types/api/Category";
import { Page } from "@/@types/api/Page";
import { QUERY_KEY } from "@/const/queryKey";
import api from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCategory(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.CATEGORIES] });

      const previousCategories = queryClient.getQueryData([
        QUERY_KEY.CATEGORIES,
      ]);

      queryClient.setQueryData(
        [QUERY_KEY.CATEGORIES],
        (oldData: Page<Category>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            content: oldData.content.filter(
              (category: Category) => category.id !== id
            ),
          };
        }
      );

      return { previousCategories };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          [QUERY_KEY.CATEGORIES],
          context.previousCategories
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORIES] });
    },
  });
};

const deleteCategory = async (id: string) => {
  try {
    if (!id) {
      throw new Error("ID is required");
    }
    
    await api.delete(`/category/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw new Error("Failed to delete category");
  }
};

export default useDeleteCategory;