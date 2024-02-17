import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ cabinToEdit, onClose }) {
  const { id: editId, ...editValues } = cabinToEdit || {};
  const isEditSession = Boolean(editId);
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const isWorking = isCreating || isEditing;

  const onSubmit = (newCabin) => {
    const image =
      typeof newCabin.image === "string" ? newCabin.image : newCabin.image[0];

    if (isEditSession)
      editCabin(
        { newCabinData: { ...newCabin, image }, id: editId },
        {
          onSuccess: () => {
            reset();
            onClose?.();
          },
        }
      );
    else
      createCabin(
        { ...newCabin, image: image },
        {
          onSuccess: () => {
            reset();
            onClose?.();
          },
        }
      );
  };

  const onError = (errors) => {
    console.error(errors);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onClose ? "modal" : "regular"}>
      <FormRow label={"Cabin Name"} error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow label={"Maximum Capacity"} error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1 ",
            },
          })}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow label={"Regular Price"} error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Regular Price should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label={"Discount"} error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) ||
              "Discount should be less than regular price",
          })}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow
        label={"Description for website"}
        error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow label={"Cabin photo"}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button onClick={() => onClose?.()} variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
