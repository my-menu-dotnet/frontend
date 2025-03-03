import Button from "@/components/Button";

type FooterButtonsProps = {
  onClickNext?: () => void;
  onClickBack?: () => void;
  hasBack?: boolean;
  hasNext?: boolean;
};

export default function FooterButtons({
  onClickNext,
  onClickBack,
  hasBack = true,
  hasNext = true,
}: FooterButtonsProps) {
  return (
    <div className="mt-4 w-full flex justify-between">
      <div>
        {hasBack && (
          <Button
            onPress={onClickBack}
            variant="faded"
            color="default"
            text="Voltar"
          />
        )}
      </div>
      <div>{hasNext && <Button onPress={onClickNext} text="Próximo" />}</div>
    </div>
  );
}
