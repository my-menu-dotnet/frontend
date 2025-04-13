import { Category } from "@/@types/api/Category";
import { Page } from "@/@types/api/Page";
import { QUERY_KEY } from "@/const/queryKey";
import api from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: Partial<Category>;
      id: string | undefined;
    }) => updateCreateCategory(data, id),
    onMutate: async ({ data, id }) => {
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
            content: oldData.content.map((category: Category) =>
              category.id === id ? { ...category, ...data } : category
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

const updateCreateCategory = async (
  data: Partial<Category>,
  id: string | undefined
) => {
  try {
    const response = await api(id ? `/category/${id}` : "/category", {
      method: id ? "PUT" : "POST",
      data,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw error;
  }
};

export default useMutateCategory;
