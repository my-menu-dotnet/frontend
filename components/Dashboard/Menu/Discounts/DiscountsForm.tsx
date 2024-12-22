import { useMutation } from "@tanstack/react-query";

type DiscountsFormProps = {
  
}

export default function DiscountsForm() {

  const {mutate} = useMutation({
    mutationKey: ["create-update-discounts"],
    mutationFn: async () => {
      
    },
  });
  
  return (
    <></>
  )
}