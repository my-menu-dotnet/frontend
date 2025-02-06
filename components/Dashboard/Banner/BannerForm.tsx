import Button from "@/components/Button";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Switch from "@/components/Switch";
import Textarea from "@/components/Textarea";
import useUpdateCreateBanner from "@/hooks/mutate/useUpdateCreateBanner";
import useBanners from "@/hooks/queries/banner/useBanners";
import useInfiniteFood from "@/hooks/queries/food/useInfiniteFood";
import useCategorySelect from "@/hooks/queries/useCategorySelect";
import api from "@/services/api";
import { Banner, BannerRedirect, BannerType } from "@/types/api/Banner";
import { Food } from "@/types/api/Food";
import { bannerRedirectMasks, bannerTypeMasks } from "@/utils/lists";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  UIEventHandler,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Control, Controller, useForm, UseFormReturn } from "react-hook-form";
import { IoInformationCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";

type BannerForm = {
  title: string;
  description?: string;
  image_id: string;
  category_id: string;
  food_id: string;
  redirect: BannerRedirect;
  type: BannerType;
  url: string;
  active: boolean;
};

const schema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().optional(),
  image_id: Yup.string().required(),
  category_id: Yup.string().optional(),
  food_id: Yup.string().optional(),
  redirect: Yup.string().optional(),
  type: Yup.string().required(),
  url: Yup.string().optional(),
  active: Yup.boolean().required(),
});

type BannerFormProps = {
  banner?: Banner;
  onSuccess?: () => void;
};

export type BannerFormRef = UseFormReturn<BannerForm>;

const BannerForm = forwardRef<BannerFormRef, BannerFormProps>(
  ({ onSuccess, banner }, ref) => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const router = useRouter();
    const { mutateAsync, isPending } = useUpdateCreateBanner<BannerForm>();
    const { refetch } = useBanners();

    const form = useForm<BannerForm>({
      resolver: yupResolver(schema),
      defaultValues: {
        title: banner?.title || "",
        description: banner?.description || "",
        category_id: banner?.category?.id || "",
        food_id: banner?.food?.id || "",
        image_id: banner?.image?.id || "",
        redirect: banner?.redirect,
        type: banner?.type,
        url: banner?.url || "",
        active: banner?.active || true,
      },
    });
    const { control, watch, handleSubmit } = form;
    const redirect = watch("redirect");

    useImperativeHandle(ref, () => form);

    const handleBannerSubmit = (data: BannerForm) => {
      const res = mutateAsync(data);

      toast.promise(res, {
        pending: "Enviando banner",
        success: "Banner enviado com sucesso",
        error: "Erro ao enviar banner",
      });

      res.then(() => onSuccess?.());
    };

    const handleBannerRemove = async () => {
      const res = api.delete(`/banner/${banner?.id}`);

      toast.promise(res, {
        pending: "Removendo banner",
        success: "Banner removido com sucesso",
        error: "Erro ao remover o banner",
      });

      res.then(() => {
        refetch().then(() => router.push("/dashboard/banners"));
      });
    };

    return (
      <>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(handleBannerSubmit)();
          }}
        >
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                isRequired
                label="Título"
                placeholder="Digite o título"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                label="Descrição"
                placeholder="Digite a descrição"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="redirect"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                data-test="select-redirect"
                className="w-full"
                label="Redirecionar"
                placeholder="Selecione um redirecionamento"
                variant="bordered"
                classNames={{
                  trigger: "border-1 rounded-lg",
                  listboxWrapper: "border-1 rounded-lg",
                }}
                selectedKeys={[field.value]}
                errorMessage={fieldState.error?.message}
                {...field}
              >
                {Object.keys(bannerRedirectMasks).map((key) => (
                  <SelectItem
                    data-test={`select-item-${
                      bannerRedirectMasks[key as BannerRedirect]
                    }`}
                    key={key}
                  >
                    {bannerRedirectMasks[key as BannerRedirect]}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          {redirect === "FOOD" && <FoodSelect control={control} />}
          {redirect === "CATEGORY" && <CategorySelect control={control} />}
          {redirect === "URL" && (
            <Controller
              name="url"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  label="URL"
                  placeholder="Digite a URL"
                  {...field}
                />
              )}
            />
          )}
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex items-center gap-2">
                <Select
                  data-test="select-type"
                  className="w-full"
                  label="Tipo"
                  placeholder="Selecione um tipo"
                  variant="bordered"
                  classNames={{
                    trigger: "border-1 rounded-lg",
                    listboxWrapper: "border-1 rounded-lg",
                  }}
                  selectedKeys={[field.value]}
                  isRequired
                  errorMessage={fieldState.error?.message}
                  {...field}
                >
                  {Object.keys(bannerTypeMasks).map((key) => (
                    <SelectItem
                      data-test={`select-item-${
                        bannerTypeMasks[key as BannerType]
                      }`}
                      key={key}
                    >
                      {bannerTypeMasks[key as BannerType]}
                    </SelectItem>
                  ))}
                </Select>
                <Tooltip
                  content={
                    <>
                      <p>
                        DESKTOP: O banner desktop deve ter a proporção de 16:9
                        (1920x1080, 1280x720, 854x480, 640x360)
                      </p>
                      <p>MOBILE: </p>
                    </>
                  }
                >
                  <IoInformationCircleOutline
                    size={25}
                    className="text-gray-400"
                  />
                </Tooltip>
              </div>
            )}
          />
          <Controller
            name="image_id"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <ImagePicker
                  fileStorage={banner?.image}
                  onFileChange={(file) => field.onChange(file.id)}
                  errorMessage={fieldState.error?.message}
                />
              </>
            )}
          />
          <div className="w-full flex justify-between">
            <Controller
              control={control}
              name="active"
              render={({ field }) => <Switch.Active {...field} />}
            />
            <div className="flex gap-2">
              {banner?.id && (
                <Button
                  color="danger"
                  text="Remover"
                  type="button"
                  variant="light"
                  onPress={() => setDeleteOpen(true)}
                />
              )}
              <Button
                data-test="input-submit"
                text="Enviar"
                type="submit"
                isLoading={isPending}
              />
            </div>
          </div>
        </form>

        <DeleteConfirmation
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleBannerRemove}
          header={<>Remover Banner</>}
          body={
            <p>
              Tem certeza que deseja remover o banner (
              <span className="font-bold">{banner?.title}</span>)
            </p>
          }
        />
      </>
    );
  }
);

const FoodSelect = ({ control }: { control: Control<BannerForm, unknown> }) => {
  const { data: foods, fetchNextPage, isFetching } = useInfiniteFood();
  const foodsMap = useMemo<Food[]>(
    () => foods?.pages.flatMap((page) => page?.content) || [],
    [foods]
  );

  const handleScroll: UIEventHandler<HTMLSelectElement> = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight
    ) {
      fetchNextPage();
    }
  };

  return (
    <Controller
      name="food_id"
      control={control}
      render={({ field, fieldState }) => (
        <Select
          data-test="select-food"
          className="w-full"
          label="Produto"
          placeholder="Selecione um produto"
          variant="bordered"
          classNames={{
            trigger: "border-1 rounded-lg",
            listboxWrapper: "border-1 rounded-lg",
          }}
          selectedKeys={[field.value]}
          isInvalid={Boolean(fieldState.error)}
          errorMessage={fieldState.error?.message}
          isLoading={isFetching}
          onScrollCapture={handleScroll}
        >
          {foodsMap?.map((food) => (
            <SelectItem key={food.id} value={food.id}>
              {food.name}
            </SelectItem>
          ))}
        </Select>
      )}
    />
  );
};

const CategorySelect = ({
  control,
}: {
  control: Control<BannerForm, unknown>;
}) => {
  const { data: categories } = useCategorySelect();

  return (
    <Controller
      name="category_id"
      control={control}
      render={({ field, fieldState }) => (
        <Select
          data-test="select-category"
          className="w-full"
          label="Categoria"
          placeholder="Selecione uma categoria"
          variant="bordered"
          classNames={{
            trigger: "border-1 rounded-lg",
            listboxWrapper: "border-1 rounded-lg",
          }}
          selectedKeys={[field.value]}
          isInvalid={Boolean(fieldState.error)}
          errorMessage={fieldState.error?.message}
          isLoading={!categories}
          {...field}
        >
          {categories! &&
            Object.keys(categories).map((key) => (
              <SelectItem
                data-test={`select-item-${categories[key]}`}
                key={key}
              >
                {categories[key]}
              </SelectItem>
            ))}
        </Select>
      )}
    />
  );
};

BannerForm.displayName = "BannerForm";

export default BannerForm;
