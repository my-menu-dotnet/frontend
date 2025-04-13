import { Category } from "@/@types/api/Category";
import { Page } from "@/@types/api/Page";
import { QUERY_KEY } from "@/const/queryKey";
import api from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutateCategoryActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      fetchUpdateCategoryActive(id, active),
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.CATEGORIES] });
  
      const previousCategories = queryClient.getQueryData([
        QUERY_KEY.CATEGORIES,
      ]);
  
      queryClient.setQueryData([QUERY_KEY.CATEGORIES], (oldData: Page<Category>) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          content: oldData.content.map((category: Category) =>
            category.id === id ? { ...category, active } : category
          )
        };
      });
  
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

const fetchUpdateCategoryActive = async (id: string, active: boolean) => {
  try {
    if (!id) {
      throw new Error("ID is required");
    }

    const { data } = await api.patch(`/category/active/${id}`, {
      active,
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Category not found");
  }
};

export default useMutateCategoryActive;
