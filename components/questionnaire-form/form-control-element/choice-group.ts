type InternalOption = {
  id: number;
  label: string;
};

const toInternal = (value: string[]): InternalOption[] =>
  value.map((option) => ({
    id: createId(),
    label: option,
  }));

const fromInternal = (value: InternalOption[]): string[] =>
  value.map((option) => option.label);

export const useChoiceGroupFromControl = (options: Ref<string[]>) => {
  const internalOptions = ref<InternalOption[]>(toInternal(options.value));

  watch(
    () => options.value,
    (newValue) => {
      internalOptions.value = toInternal(newValue);
    },
  );

  watch(internalOptions, (newValue) => {
    const externalValue = fromInternal(newValue);
    if (
      externalValue.length === options.value.length &&
      externalValue.every((v, i) => v === options.value[i])
    ) {
      return;
    }

    options.value = externalValue;
  });

  const addOption = (index?: number) => {
    const id = createId();
    const insertIndex = index ?? internalOptions.value.length;
    internalOptions.value.splice(insertIndex, 0, {
      id,
      label: "",
    });
    return id;
  };

  const updateOption = (index: number, label: string) => {
    internalOptions.value[index].label = label;
  };

  const removeOption = (index: number) => {
    internalOptions.value.splice(index, 1);
  };

  const moveOption = (oldIndex: number, newIndex: number) => {
    const option = internalOptions.value.splice(oldIndex, 1)[0];
    internalOptions.value.splice(newIndex, 0, option);
  };

  return {
    internalOptions,
    addOption,
    updateOption,
    removeOption,
    moveOption,
  };
};
