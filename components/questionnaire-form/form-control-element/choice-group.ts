type InternalOption = {
  id: number;
  label: string;
};

const toInternal = (value: string[]): InternalOption[] => {
  const converted = value.map((option) => ({
    id: createId(),
    label: option,
  }));

  // 新しい選択肢を追加するように常に末尾に空の選択肢を用意する
  return [...converted, { id: createId(), label: '' }];
};

const fromInternal = (value: InternalOption[]): string[] => value.slice(0, -1).map((option) => option.label);

const isSameOptions = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

export const useChoiceGroupFromControl = (options: Ref<string[]>) => {
  const internalOptions = ref<InternalOption[]>(toInternal(options.value));

  watch(
    () => options.value,
    (newValue) => {
      const currentValue = fromInternal(internalOptions.value);
      if (isSameOptions(newValue, currentValue)) return;

      internalOptions.value = toInternal(newValue);
    },
  );

  watch(
    internalOptions,
    (newValue) => {
      const externalValue = fromInternal(newValue);
      if (isSameOptions(externalValue, options.value)) return;

      options.value = externalValue;
    },
    { deep: true },
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
