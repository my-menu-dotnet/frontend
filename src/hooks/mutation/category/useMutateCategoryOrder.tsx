import { Category } from "@/@types/api/Category";
import { Page } from "@/@types/api/Page";
import { QUERY_KEY } from "@/const/queryKey";
import api from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutateCategoryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => fetchUpdateCategoryActive(ids),
    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.CATEGORIES] });

      const previousCategories = queryClient.getQueryData([
        QUERY_KEY.CATEGORIES,
      ]);

      queryClient.setQueryData(
        [QUERY_KEY.CATEGORIES],
        (oldData: Page<Category>) => {
          if (!oldData) return oldData;

          const categoryMap = new Map(
            oldData.content.map((category) => [category.id, category])
          );

          const orderedContent = ids
            .map((id) => categoryMap.get(id))
            .filter(Boolean) as Category[];

          return {
            ...oldData,
            content: orderedContent,
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

const fetchUpdateCategoryActive = async (ids: string[]) => {
  try {
    const { data } = await api.patch(`/category/order`, {
      ids,
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Category not found");
  }
};

export default useMutateCategoryOrder;
