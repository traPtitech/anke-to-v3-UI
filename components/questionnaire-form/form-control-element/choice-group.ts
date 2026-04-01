type InternalOption = {
  id: number;
  label: string;
};

const toInternal = (value: string[]): InternalOption[] =>
  value.map((option) => ({
    id: createId(),
    label: option,
  }));

const fromInternal = (value: InternalOption[]): string[] => {
  if (value.length === 0) return [];

  const lastIndex = value.length - 1;
  return value
    .filter(
      (option, index) => !(index === lastIndex && option.label.trim() === ''),
    )
    .map((option) => option.label);
};

const isSameOptions = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export const useChoiceGroupFromControl = (options: Ref<string[]>) => {
  const initializeInternalOptions = () => {
    const internal = toInternal(options.value);
    if (internal.length === 0) {
      internal.push({
        id: createId(),
        label: '',
      });
    }
    return internal;
  };

  const internalOptions = ref<InternalOption[]>(initializeInternalOptions());

  watch(
    () => options.value,
    (newValue) => {
      const currentValue = fromInternal(internalOptions.value);
      if (isSameOptions(newValue, currentValue)) {
        return;
      }

      internalOptions.value = toInternal(newValue);
      if (internalOptions.value.length === 0) {
        internalOptions.value.push({
          id: createId(),
          label: '',
        });
      }
    },
  );

  watch(
    internalOptions,
    (newValue) => {
      const externalValue = fromInternal(newValue);
      if (isSameOptions(externalValue, options.value)) {
        return;
      }

      options.value = externalValue;
    },
    {
      deep: true,
    },
  );

  const addOption = (index?: number) => {
    const id = createId();
    const insertIndex = index ?? internalOptions.value.length;
    internalOptions.value.splice(insertIndex, 0, {
      id,
      label: '',
    });
    return id;
  };

  const updateOption = (index: number, label: string) => {
    internalOptions.value[index].label = label;
    const isLastOption = index === internalOptions.value.length - 1;
    const isBecomingNonEmpty = label.trim() !== '';
    if (isLastOption && isBecomingNonEmpty) {
      addOption();
    }
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
